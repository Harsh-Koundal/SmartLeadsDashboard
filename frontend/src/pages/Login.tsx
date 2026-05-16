import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      dispatch(setCredentials(response.data.data));
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Security Login</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Access your analytics command center.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Terminal</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              {...register('email')}
              type="email"
              placeholder="operator@smartleads.io"
              className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-bold dark:text-white shadow-inner"
            />
          </div>
          {errors.email && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-1 text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.email.message}</motion.p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••••••"
              className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-bold dark:text-white shadow-inner"
            />
          </div>
          {errors.password && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-1 text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.password.message}</motion.p>}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-black font-black text-xs uppercase tracking-[0.2em] py-4 px-4 rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} strokeWidth={3} />
          ) : (
            <>
              Initialize Session
              <ArrowRight size={18} strokeWidth={3} />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          New to the platform?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 font-black hover:underline uppercase tracking-wider inline-flex items-center gap-1">
            Create Access <Sparkles size={12} />
          </Link>
        </p>
      </div>
    </div>
  );
};
