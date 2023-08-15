import { apiSlice } from "../auth/apiSlice.js";

const INVOICES_URL = "/api/v1/invoices";

export const invoiceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.mutation({
      query: (data) => ({
        url: `${INVOICES_URL}`,
        method: "GET",
        body: data,
      }),
    }),
    setInvoice: builder.mutation({
      query: (data) => ({
        url: `${INVOICES_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateInvoice: builder.mutation({
      query: (id) => ({
        url: `${INVOICES_URL}/:${id}`,
        method: "PUT",
      }),
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `${INVOICES_URL}/:${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetInvoicesMutation, useSetInvoiceMutation, useUpdateInvoiceMutation, useDeleteInvoiceMutation } = invoiceApiSlice;
