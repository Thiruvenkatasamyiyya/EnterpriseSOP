import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const docsApi = createApi({
  reducerPath: 'docsApi',
  tagTypes : ["Docs"],
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/v1/' }),
  endpoints: (builder) => ({
    askQuestion : builder.mutation({
      query : (body)=>({
        url : "chat",
        method : "POST",
        body
      })
    }),
    getAllDocs: builder.query({
      query: () => `retriveSOP`,
      providesTags : ["Docs"]
    }),
    deleteDocs : builder.mutation({
      query : (body)=>({
        url : "deleteFile",
        method : "DELETE",
        body
      }),
      invalidatesTags : ["Docs"]
    })
  }),
})


export const { useGetAllDocsQuery,useDeleteDocsMutation, useAskQuestionMutation} = docsApi