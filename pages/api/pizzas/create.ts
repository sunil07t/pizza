// pages/api/pizzas/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../lib/dbConnect';
import { authOptions } from '../../api/auth/[...nextauth]'; 
import Pizza from '../../../models/Pizza';
import { QuantityType } from '../../../models/QuantityType'; 
import User from '../../../models/User'; 
import { validationResult, check } from 'express-validator';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session?.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await check('name').isLength({ min: 1 }).run(req);
    await check('ingredients.*.name').notEmpty().run(req);
    await check('ingredients.*.quantity').isNumeric().run(req);
    await check('ingredients.*.unit').isIn(Object.values(QuantityType)).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: 'Please input valid field.' });
    }

    const existingPizza = await Pizza.findOne({ 
      name: req.body.name, 
      createdBy: user._id 
    });
    if (existingPizza) {
        return res.status(400).json({ message: "A pizza with this name already exists." });
    }

    try {
      for (const ingredient of req.body.ingredients) {
        if (!Object.values(QuantityType).includes(ingredient.unit)) {
          return res.status(400).json({ message: `Invalid unit: ${ingredient.unit}` });
        }
      }

      const newPizza = new Pizza({
        ...req.body,
        createdBy: user._id, 
      });
      const savedPizza = await new Pizza(newPizza).save();

      res.status(201).json(savedPizza);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).end();
  }
}
