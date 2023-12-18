// pages/api/pizzas/delete/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import Pizza from '../../../../models/Pizza';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'PUT') {
    try {
      const pizza = await Pizza.findById(id);
      if (!pizza) {
        return res.status(404).json({ message: 'Pizza not found' });
      }

      if (pizza.show) {
        pizza.show = false;
        await pizza.save();
        res.status(200).json(pizza);
      } else {
        res.status(200).json({ message: 'Pizza is already in unshow state' });
      }

    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).end();
  }
}
