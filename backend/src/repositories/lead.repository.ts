import Lead from '../models/Lead';
import { ILead } from '../types';
import mongoose from 'mongoose';

export class LeadRepository {
  async create(leadData: Partial<ILead>): Promise<ILead> {
    const lead = new Lead(leadData);
    return lead.save();
  }

  async findById(id: string): Promise<ILead | null> {
    return Lead.findById(id).populate('createdBy', 'name email role');
  }

  async findAll(
    filter: any,
    sort: any,
    page: number,
    limit: number
  ): Promise<{ data: ILead[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    return { data, total };
  }

  async update(id: string, leadData: Partial<ILead>): Promise<ILead | null> {
    return Lead.findByIdAndUpdate(id, leadData, { new: true }).populate('createdBy', 'name email');
  }

  async delete(id: string): Promise<ILead | null> {
    return Lead.findByIdAndDelete(id);
  }

  async findForExport(filter: any, sort: any): Promise<ILead[]> {
    return Lead.find(filter).sort(sort).populate('createdBy', 'name email');
  }
}
