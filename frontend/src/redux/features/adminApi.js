import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseUrl=import.meta.env.VITE_API_URL;

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api/v1`,credentials: "include" }),
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => ({
        url : "/admin/users",
        method : "GET"
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllUserQuery } = adminApi