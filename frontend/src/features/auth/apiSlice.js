import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_APP_ENV === 'production' ? "https://invoice-withdb-bl7o-dev.fl0.io" : '' });

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Invoice"],
  endpoints: () => ({}),
});
