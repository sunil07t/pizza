// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  image: string;
  name: string;
}

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  image: { type: String, required: false, unique: false },
  name: { type: String, required: false, unique: false },
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
