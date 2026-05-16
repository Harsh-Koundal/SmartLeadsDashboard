import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserCheck, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'SALES']),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'SALES' }
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await api.post('/auth/register', data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl text-black font-black text-slate-800 dark:text-white tracking-tight">Create Identity</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Join the next generation of lead management.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. John Doe"
              className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-bold dark:text-white shadow-inner"
            />
          </div>
          {errors.name && <p className="mt-1 text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              {...register('email')}
              type="email"
              placeholder="operator@smartleads.io"
              className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-bold dark:text-white shadow-inner"
            />
          </div>
          {errors.email && <p className="mt-1 text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••••••"
              className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-bold dark:text-white shadow-inner"
            />
          </div>
          {errors.password && <p className="mt-1 text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Platform Role</label>
          <div className="relative group">
            <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <select
              {...register('role')}
              className="w-full pl-12 pr-10 py-3.5 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-bold dark:text-white shadow-inner appearance-none cursor-pointer"
            >
              <option value="SALES">Sales Representative</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-black font-black text-xs uppercase tracking-[0.2em] py-4 px-4 rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 mt-4"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} strokeWidth={3} />
          ) : (
            <>
              Deploy Account
              <ArrowRight size={18} strokeWidth={3} />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Already verified?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-black hover:underline uppercase tracking-wider inline-flex items-center gap-1">
            Sign In Now <Sparkles size={12} />
          </Link>
        </p>
      </div>
    </div>
  );
};
