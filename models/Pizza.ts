// models/Pizza.ts
import mongoose, { Schema, Document } from 'mongoose';
import { QuantityType } from './QuantityType'; 

interface IPizza extends Document {
  name: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: QuantityType;
  }>;
  show: boolean;
  createdBy: mongoose.Schema.Types.ObjectId;  
}

const pizzaSchema: Schema = new Schema({
  name: { type: String, required: true, unique: false },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: Object.values(QuantityType), required: true },
  }],
  show: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
});

export default mongoose.models.Pizza || mongoose.model<IPizza>('Pizza', pizzaSchema);
