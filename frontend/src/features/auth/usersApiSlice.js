import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/v1/users";

export const usersApiSlice = apiSlice.injectEndpoints({

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // logout: builder.mutation({
    //   query: () => ({
    //     url: `${USERS_URL}/logout`,
    //     method: "POST",
    //   }),
    // }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `${data.token}`,
        }
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} = usersApiSlice;
