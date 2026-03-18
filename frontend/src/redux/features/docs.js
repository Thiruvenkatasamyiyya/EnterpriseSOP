import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const docsApi = createApi({
  reducerPath: 'docsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/v1/' }),
  endpoints: (builder) => ({
    getAllDocs: builder.query({
      query: () => `retriveSOP`,
    }),
  }),
})


export const { useGetAllDocsQuery } = docsApi