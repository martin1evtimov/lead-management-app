// store.ts
import { configureStore } from "@reduxjs/toolkit";
import leadsReducer from "./leadsSlice";

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
  },
});

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
