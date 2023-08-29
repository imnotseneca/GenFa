import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url =
import.meta.env.VITE_APP_ENV === "production"
  ? import.meta.env.VITE_APP_PROD_BACK_URL
  : import.meta.env.VITE_APP_DEV_BACK_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${url}`,
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Invoice"],
  endpoints: () => ({}),
});
