import React, { useEffect, useState, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Trash2,
  Edit2,
  LayoutGrid,
  List as ListIcon,
  RotateCcw
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setLeads, setLoading, setFilters, setPage, removeLead } from '../store/slices/leadSlice';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate, cn } from '../utils';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

export const LeadsList = () => {
  const dispatch = useDispatch();
  const { leads, pagination, filters, loading } = useSelector((state: RootState) => state.leads);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchLeads = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: filters.status,
        source: filters.source,
        search: filters.search,
        sort: filters.sort,
      });
      const response = await api.get(`/leads?${params.toString()}`);
      dispatch(setLeads(response.data));
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        status: filters.status,
        source: filters.source,
        search: filters.search,
        sort: filters.sort,
      });
      const response = await api.get(`/leads/export?${params.toString()}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to export leads');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      dispatch(removeLead(id));
      toast.success('Lead deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Leads Management</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">View, filter, and manage your customer database with ease.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-black shadow-sm"
          >
            <Download size={18} />
            Export Data
          </button>
          <Link
            to="/leads/create"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-black rounded-2xl hover:bg-primary-700 transition-all text-sm font-black shadow-lg shadow-primary-500/25"
          >
            <Plus size={20} strokeWidth={3} />
            Create Lead
          </Link>
        </div>
      </div>

      {/* Filters Container */}
      <div className="bg-white dark:bg-slate-800/40 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-2 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search leads by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-transparent border focus:border-primary-500/50 rounded-2xl outline-none transition-all text-sm font-medium dark:text-white"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto p-1">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-xl border border-transparent focus-within:border-primary-500/50 transition-all">
            <Filter size={14} className="text-slate-400" />
            <select
              value={filters.status}
              onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
              className="bg-transparent text-sm font-bold outline-none dark:text-white min-w-[100px] py-2"
            >
              <option value="">All Status</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-xl border border-transparent focus-within:border-primary-500/50 transition-all">
            <LayoutGrid size={14} className="text-slate-400" />
            <select
              value={filters.source}
              onChange={(e) => dispatch(setFilters({ source: e.target.value }))}
              className="bg-transparent text-sm font-bold outline-none dark:text-white min-w-[100px] py-2"
            >
              <option value="">All Sources</option>
              <option value="WEBSITE">Website</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="REFERRAL">Referral</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-xl border border-transparent focus-within:border-primary-500/50 transition-all">
            <ListIcon size={14} className="text-slate-400" />
            <select
              value={filters.sort}
              onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}
              className="bg-transparent text-sm font-bold outline-none dark:text-white min-w-[100px] py-2"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <button 
            onClick={() => dispatch(setFilters({ status: '', source: '', search: '' }))}
            className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all"
            title="Reset Filters"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] z-20 flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest text-primary-600">Loading Leads...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lead Profile</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Account Mgr</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"></th>
              </tr>
            </thead>
            <motion.tbody 
              variants={container}
              initial="hidden"
              animate="show"
              className="divide-y divide-slate-100 dark:divide-slate-800"
            >
              {leads.map((lead) => (
                <motion.tr 
                  variants={item}
                  key={lead._id} 
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all duration-300"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-black text-sm shadow-inner group-hover:scale-110 transition-transform duration-300">
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
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-300">
                        {lead.createdBy.name[0]}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">{lead.createdBy.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{formatDate(lead.createdAt)}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link to={`/leads/edit/${lead._id}`} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all">
                        <Edit2 size={16} strokeWidth={2.5} />
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <button 
                          onClick={() => handleDelete(lead._id)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {leads.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center">
                        <Search className="text-slate-200 dark:text-slate-800" size={40} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-800 dark:text-white font-black text-lg">No leads match your search</p>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
                      </div>
                      <button 
                        onClick={() => dispatch(setFilters({ status: '', source: '', search: '' }))}
                        className="mt-2 px-6 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary-100 transition-all"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>

        {/* Pagination Container */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/30 dark:bg-slate-900/30">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-800 dark:text-white">{(pagination.page - 1) * pagination.limit + 1}</span> - <span className="text-slate-800 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.totalRecords)}</span> of <span className="text-slate-800 dark:text-white">{pagination.totalRecords}</span> Records
          </p>
          <div className="flex items-center gap-3">
            <button
              disabled={pagination.page === 1}
              onClick={() => dispatch(setPage(pagination.page - 1))}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={20} className="dark:text-white" />
            </button>
            <div className="flex items-center gap-1.5">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => dispatch(setPage(i + 1))}
                  className={cn(
                    "w-11 h-11 rounded-2xl text-xs font-black transition-all",
                    pagination.page === i + 1 
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => dispatch(setPage(pagination.page + 1))}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight size={20} className="dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
