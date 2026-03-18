import { configureStore } from '@reduxjs/toolkit'
import { docsApi } from './features/docs'
import { userApi } from './features/userApi'
import { authApi } from './features/authApi'
import userReducer from "./userSlice"
import { adminApi } from './features/adminApi'
export const store = configureStore({
  reducer: {
    auth: userReducer,
    [docsApi.reducerPath]: docsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath] : authApi.reducer,
    [adminApi.reducerPath] : adminApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([docsApi.middleware,userApi.middleware,authApi.middleware,adminApi.middleware]),
})
