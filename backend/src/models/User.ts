import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'SALES'], default: 'SALES' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
