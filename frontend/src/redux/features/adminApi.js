import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseUrl=import.meta.env.VITE_API_URL;

export const adminApi = createApi({
  reducerPath: 'adminApi',
  tagTypes : ["Admin"],
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api/v1`,credentials: "include" }),
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => ({
        url : "/admin/users",
        method : "GET"
      }),
      providesTags : ["Admin"]
    }),
    permitUser : builder.mutation({
      query : (body)=>({
        url : "/admin/permit",
        method : "PATCH",
        body
      }),
      invalidatesTags : ["Admin"]
    })
  }),
})

export const { useGetAllUserQuery,usePermitUserMutation } = adminApi