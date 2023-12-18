// pages/api/pizzas/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../lib/dbConnect';
import { authOptions } from '../../api/auth/[...nextauth]';
import Pizza from '../../../models/Pizza';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.email) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const pizzas = await Pizza.find({ createdBy: user._id, show: true })
                              .skip(skip)
                              .limit(limit);

    res.status(200).json(pizzas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
