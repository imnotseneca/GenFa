import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth/authSlice.js'
import invoiceReducer from './features/invoices/invoiceSlice.js'
import { apiSlice } from "./features/auth/apiSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        invoice: invoiceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});


export default store;