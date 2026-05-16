import mongoose, { Schema } from 'mongoose';
import { ILead } from '../types';

const LeadSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'],
      default: 'NEW',
    },
    source: {
      type: String,
      enum: ['WEBSITE', 'INSTAGRAM', 'REFERRAL'],
      default: 'WEBSITE',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Add indexes for search and filtering
LeadSchema.index({ name: 'text', email: 'text' });
LeadSchema.index({ status: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ createdAt: -1 });

export default mongoose.model<ILead>('Lead', LeadSchema);
