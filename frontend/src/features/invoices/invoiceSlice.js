import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  invoiceInfo: localStorage.getItem('invoiceInfo')
    ? JSON.parse(localStorage.getItem('invoiceInfo'))
    : [],
};

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      state.invoiceInfo = action.payload;
      localStorage.setItem('invoiceInfo', JSON.stringify(action.payload));
    },
  },
})

export default invoiceSlice.reducer