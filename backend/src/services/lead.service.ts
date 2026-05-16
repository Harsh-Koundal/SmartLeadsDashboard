import { LeadRepository } from '../repositories/lead.repository';
import { ILead, LeadStatus, LeadSource } from '../types';
import { AppError } from '../middlewares/error.middleware';
import mongoose from 'mongoose';

const leadRepository = new LeadRepository();

export class LeadService {
  async createLead(leadData: Partial<ILead>) {
    return leadRepository.create(leadData);
  }

  async getLeads(query: any) {
    const { status, source, search, sort, page = 1, limit = 10 } = query;

    const filter: any = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions: any = {};
    if (sort === 'oldest') {
      sortOptions.createdAt = 1;
    } else {
      sortOptions.createdAt = -1; // default latest
    }

    const { data, total } = await leadRepository.findAll(
      filter,
      sortOptions,
      Number(page),
      Number(limit)
    );

    return {
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalRecords: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getLeadById(id: string) {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return lead;
  }

  async updateLead(id: string, leadData: Partial<ILead>) {
    const lead = await leadRepository.update(id, leadData);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return lead;
  }

  async deleteLead(id: string) {
    const lead = await leadRepository.delete(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return lead;
  }

  async exportLeads(query: any) {
    const { status, source, search, sort } = query;

    const filter: any = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions: any = {};
    if (sort === 'oldest') {
      sortOptions.createdAt = 1;
    } else {
      sortOptions.createdAt = -1;
    }

    return leadRepository.findForExport(filter, sortOptions);
  }
}
