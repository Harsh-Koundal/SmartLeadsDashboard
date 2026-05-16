import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Bell, Search, Command } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="h-20 glass sticky top-0 z-30 transition-all duration-300">
      <div className="h-full px-8 flex items-center justify-between gap-8">
        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search leads, analytics, or settings..."
              className="w-full pl-12 pr-12 py-3 bg-slate-100/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-medium dark:text-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-300/50 dark:border-slate-700/50">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button className="p-2.5 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all relative group">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform"></span>
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>
            <ThemeToggle />
          </div>
          
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 ml-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{user?.name}</p>
              <div className="flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Active Now</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 p-[2px] shadow-lg shadow-primary-500/20">
              <div className="w-full h-full rounded-[10px] bg-white dark:bg-slate-900 flex items-center justify-center font-black text-primary-600 dark:text-primary-400 text-sm">
                {user?.name[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
