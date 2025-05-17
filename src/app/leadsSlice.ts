// leadsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Lead = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedin: string;
  visas: string[];
  additionalInfo: string;
  resumeName: string;
  resumeSize: number;
  status: string;
  submitted: string;
};

interface LeadsState {
  data: Lead[];
}

const initialState: LeadsState = {
  data: [],
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.data = action.payload;
    },
    updateLeadStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
      const lead = state.data.find((l) => l.id === action.payload.id);
      if (lead) {
        lead.status = action.payload.status;
      }
    },
  },
});

export const { setLeads, updateLeadStatus } = leadsSlice.actions;
export default leadsSlice.reducer;
