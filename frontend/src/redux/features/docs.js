import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseUrl=import.meta.env.VITE_API_URL;
export const docsApi = createApi({
  reducerPath: 'docsApi',
  tagTypes : ["Docs"],
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api/v1/` }),
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