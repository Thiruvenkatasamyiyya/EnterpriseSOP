
import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userApi } from './userApi'
const baseUrl = import.meta.env.VITE_API_URL
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery:fetchBaseQuery({baseUrl:`${baseUrl}/api/v1`,credentials: "include"}),
    keepUnusedDataFor: 60,
    endpoints: (builder) => ({
        register:builder.mutation({
            query(body){
                return {
                   url:"/register",
                   method:"POST",
                   body
                }
            },
        }),
        login:builder.mutation({
            query(body){
                console.log(body);
                
                return {
                   url:"/login",
                   method:"POST",
                   body
                }
            },
            async onQueryStarted(arg,{dispatch,queryFulfilled}){
                try{                  
                    await queryFulfilled                   
                    await dispatch(userApi.endpoints.getMe.initiate(null))
                }catch(err){
                    console.log(err);
                }
            }
        }),
        logout : builder.query({
            query :() => "/logout"
        }),
        forgetPassword : builder.mutation({
            query(body){
                return{
                    url : '/forget',
                    method: 'POST',
                    body
                }
            }
        }),
        resetPassword : builder.mutation({
            query:({token,body})=>({
                
                    url:`/reset/${token}`,
                    method : 'POST',
                    body
                
            })
        }),
        updateProfile : builder.mutation({
            query(body){
                return{
                    url : '/updateProfile',
                    method : 'PUT',
                    body
                }
            }
        })

    })
})

export const { useLoginMutation, useRegisterMutation,useLazyLogoutQuery,
    useForgetPasswordMutation,useResetPasswordMutation, useUpdateProfileMutation} = authApi;