
import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setIsAuthenticated, setUser } from '../userSlice.js';

const baseUrl = import.meta.env.VITE_API_URL
export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery:fetchBaseQuery({baseUrl:`${baseUrl}/api/v1`, credentials: "include"}),
    tagTypes :["User"],
    endpoints: (builder) => ({
        getMe:builder.query({
            query:() => "/me",

            async onQueryStarted(args,{dispatch,queryFulfilled}){
                try{
                    console.log("fine2");
                    
                    const {data} = await queryFulfilled
                    console.log(data);
                    
                    dispatch(setUser(data.user));
                    dispatch(setIsAuthenticated(true))
                }catch(err){
                    console.log(err);
                }
            },
            providesTags :["User"]
  
        }),
        uploadAvatar : builder.mutation({
            query(body){
                return{
                    url :'uploadAvatar',
                    method : 'PUT',
                    body
                }
            },
            invalidatesTags :["User"]
        }),
        updatePassword : builder.mutation({
            query(body){
                return{
                    url :'updatePassword',
                    method : 'PUT',
                    body
                }
            },
            invalidatesTags :["User"]
        }),

        

    })
})

export const { useGetMeQuery,useUploadAvatarMutation,useUpdatePasswordMutation } = userApi;