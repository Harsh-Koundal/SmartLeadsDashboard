import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

interface LeadState {
  leads: Lead[];
  pagination: Pagination;
  loading: boolean;
  filters: {
    status: string;
    source: string;
    search: string;
    sort: string;
  };
}

const initialState: LeadState = {
  leads: [],
  pagination: {
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  },
  loading: false,
  filters: {
    status: '',
    source: '',
    search: '',
    sort: 'latest',
  },
};

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<{ data: Lead[]; pagination: Pagination }>) => {
      state.leads = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<LeadState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to page 1 on filter change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    addLead: (state, action: PayloadAction<Lead>) => {
      state.leads.unshift(action.payload);
    },
    updateLeadInState: (state, action: PayloadAction<Lead>) => {
      const index = state.leads.findIndex((l) => l._id === action.payload._id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
    removeLead: (state, action: PayloadAction<string>) => {
      state.leads = state.leads.filter((l) => l._id !== action.payload);
    },
  },
});

export const {
  setLeads,
  setLoading,
  setFilters,
  setPage,
  addLead,
  updateLeadInState,
  removeLead,
} = leadSlice.actions;
export default leadSlice.reducer;
