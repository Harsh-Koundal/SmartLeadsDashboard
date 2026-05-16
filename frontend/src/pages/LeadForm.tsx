import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Globe, Share2, Loader2, Save, X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST']),
  source: z.enum(['WEBSITE', 'INSTAGRAM', 'REFERRAL']),
});

type LeadFormInput = z.infer<typeof leadSchema>;

export const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const isEdit = !!id;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadFormInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'NEW',
      source: 'WEBSITE'
    }
  });

  useEffect(() => {
    if (isEdit) {
      const fetchLead = async () => {
        setFetching(true);
        try {
          const response = await api.get(`/leads/${id}`);
          reset(response.data.data);
        } catch (error) {
          toast.error('Failed to fetch lead details');
          navigate('/leads');
        } finally {
          setFetching(false);
        }
      };
      fetchLead();
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data: LeadFormInput) => {
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/leads/${id}`, data);
        toast.success('Lead updated successfully');
      } else {
        await api.post('/leads', data);
        toast.success('Lead created successfully');
      }
      navigate('/leads');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Fetching lead details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Leads
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden"
      >
        <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/10 rounded-full -mr-32 -mt-32" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight relative z-10">
            {isEdit ? 'Edit Lead Profile' : 'Create New Lead'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 relative z-10">
            Fill in the information below to {isEdit ? 'update the' : 'add a new'} lead to your database.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-bold dark:text-white shadow-inner"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="e.g. john@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-bold dark:text-white shadow-inner"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lead Status</label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <select
                  {...register('status')}
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-bold dark:text-white shadow-inner appearance-none cursor-pointer"
                >
                  <option value="NEW">New Lead</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="LOST">Lost</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Share2 size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Acquisition Source</label>
              <div className="relative group">
                <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <select
                  {...register('source')}
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-bold dark:text-white shadow-inner appearance-none cursor-pointer"
                >
                  <option value="WEBSITE">Website</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="REFERRAL">Referral</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Share2 size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/leads')}
              className="px-8 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <X size={18} strokeWidth={3} />
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-10 py-3.5 bg-primary-600 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 active:translate-y-0"
            >
              {loading ? <Loader2 className="animate-spin" size={18} strokeWidth={3} /> : <Save size={18} strokeWidth={3} />}
              {isEdit ? 'Update Profile' : 'Save Lead'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
