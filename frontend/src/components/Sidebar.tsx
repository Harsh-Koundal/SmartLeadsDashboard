import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings, 
  LogOut,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store';
import { cn } from '../utils';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Leads', path: '/leads' },
  { icon: UserPlus, label: 'Create Lead', path: '/leads/create' },
];

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <aside className="w-64 h-screen bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-40 transition-colors duration-300">
      <div className="p-8 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0b1120] rounded-full"></div>
        </div>
        <div>
          <h1 className="font-black text-xl tracking-tight text-slate-800 dark:text-white leading-none">SmartLeads</h1>
          <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Analytics Pro</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
              isActive 
                ? "bg-slate-50 dark:bg-slate-800/50 text-primary-600 dark:text-primary-400 shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3 relative z-10">
                  <item.icon size={20} className={cn("transition-transform duration-300 group-hover:scale-110", isActive && "text-primary-600 dark:text-primary-400")} />
                  <span className="font-semibold">{item.label}</span>
                </div>
                <ChevronRight size={16} className={cn("relative z-10 transition-all duration-300", isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0")} />
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 dark:bg-primary-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold shadow-inner">
              {user?.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 border border-red-100 dark:border-red-900/30 rounded-xl transition-all duration-300"
          >
            <LogOut size={14} />
            Logout Account
          </button>
        </div>
      </div>
    </aside>
  );
};
