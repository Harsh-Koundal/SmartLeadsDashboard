import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ThemeToggle } from '../components/ThemeToggle';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export const AuthLayout = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex flex-col transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute top-8 right-8 z-50">
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 dark:border-white/5 shadow-xl">
          <ThemeToggle />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-primary-600 to-blue-500 rounded-[2.5rem] mb-6 shadow-2xl shadow-primary-500/30 relative"
            >
              <Zap className="text-white fill-white" size={32} />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-white rounded-[2.5rem] opacity-20"
              />
            </motion.div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">SmartLeads</h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Analytics & Management Pro</p>
          </div>
          
          <div className="glass-card rounded-[2.5rem] overflow-hidden">
            <div className="p-1 dark:bg-slate-800/10">
              <Outlet />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              &copy; 2026 SmartLeads Inc. All Rights Reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
