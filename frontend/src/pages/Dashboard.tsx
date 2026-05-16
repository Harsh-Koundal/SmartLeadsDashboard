import React, { useEffect, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  UserCheck, 
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Activity,
  Calendar,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import { formatDate, cn } from '../utils';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.03] dark:opacity-[0.07] rounded-bl-full transition-transform duration-500 group-hover:scale-110`} />
    
    <div className="flex items-start justify-between relative z-10">
      <div className={cn(
        "p-4 rounded-2xl transition-colors duration-300",
        trend === 'up' ? "bg-green-50 dark:bg-green-500/10 text-green-600" : "bg-red-50 dark:bg-red-500/10 text-red-600"
      )}>
        <Icon size={24} />
      </div>
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black transition-colors duration-300",
        trend === 'up' ? "bg-green-50 text-green-600 dark:bg-green-500/20" : "bg-red-50 text-red-600 dark:bg-red-500/20"
      )}>
        {trend === 'up' ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
        {trendValue}
      </div>
    </div>
    
    <div className="mt-6 relative z-10">
      <h3 className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">{title}</h3>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{value}</p>
        <span className="text-[10px] font-bold text-slate-400">vs last month</span>
      </div>
    </div>
  </motion.div>
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    qualified: 0,
    lost: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/leads?limit=5');
        const allLeads = await api.get('/leads?limit=1000'); 
        
        const leads = allLeads.data.data;
        setStats({
          total: leads.length,
          new: leads.filter((l: any) => l.status === 'NEW').length,
          qualified: leads.filter((l: any) => l.status === 'QUALIFIED').length,
          lost: leads.filter((l: any) => l.status === 'LOST').length,
        });
        setRecentLeads(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
            <Activity size={16} className="text-primary-500" />
            Real-time performance analytics for your leads.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400">
            <Calendar size={14} />
            <span>May 16, 2026</span>
          </div>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20">
            Generate Report
          </button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard title="Total Leads" value={stats.total} icon={Users} trend="up" trendValue="12%" color="from-blue-500 to-cyan-400" />
        <StatCard title="New Leads" value={stats.new} icon={TrendingUp} trend="up" trendValue="5%" color="from-primary-500 to-indigo-400" />
        <StatCard title="Qualified" value={stats.qualified} icon={UserCheck} trend="up" trendValue="8%" color="from-green-500 to-emerald-400" />
        <StatCard title="Lost Leads" value={stats.lost} icon={XCircle} trend="down" trendValue="2%" color="from-red-500 to-orange-400" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
          <h3 className="font-black text-slate-800 dark:text-white text-xl tracking-tight">Recent Activity</h3>
          <button className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-black hover:underline uppercase tracking-widest">
            View All Leads
            <ExternalLink size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lead Information</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date Created</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentLeads.map((lead: any, idx: number) => (
                <motion.tr 
                  variants={item}
                  key={lead._id} 
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all duration-300"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-black text-sm shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {lead.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{lead.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm",
                      lead.status === 'NEW' && "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
                      lead.status === 'QUALIFIED' && "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
                      lead.status === 'LOST' && "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
                      lead.status === 'CONTACTED' && "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-bold">{lead.source}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{formatDate(lead.createdAt)}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center">
                        <Users className="text-slate-200 dark:text-slate-800" size={32} />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-xs">No recent leads found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
