import { apiSlice } from "./apiSlice";

const USERS_URL = "https://genfa.onrender.com/api/v1/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateProfileMutation,
} = usersApiSlice;
