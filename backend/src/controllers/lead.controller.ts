import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { ApiResponse, AuthRequest } from '../types';
import { createObjectCsvStringifier } from 'csv-writer';

const leadService = new LeadService();

export class LeadController {
  async createLead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leadData = { ...req.body, createdBy: req.user?.id };
      const lead = await leadService.createLead(leadData);
      const response: ApiResponse = {
        success: true,
        message: 'Lead created successfully',
        data: lead,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await leadService.getLeads(req.query);
      const response: ApiResponse = {
        success: true,
        message: 'Leads fetched successfully',
        data: result.data,
        pagination: result.pagination,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getLeadById(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.getLeadById(req.params.id as string);
      const response: ApiResponse = {
        success: true,
        message: 'Lead fetched successfully',
        data: lead,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateLead(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.updateLead(req.params.id as string, req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Lead updated successfully',
        data: lead,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
      await leadService.deleteLead(req.params.id as string);
      const response: ApiResponse = {
        success: true,
        message: 'Lead deleted successfully',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async exportLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const leads = await leadService.exportLeads(req.query);
      
      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'name', title: 'Name' },
          { id: 'email', title: 'Email' },
          { id: 'status', title: 'Status' },
          { id: 'source', title: 'Source' },
          { id: 'createdAt', title: 'Created At' },
        ],
      });

      const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(leads);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
      res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  }
}
