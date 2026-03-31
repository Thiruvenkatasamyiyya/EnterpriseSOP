import React from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectRouter = ({children}) => {

    const {user} = useSelector((state)=>state.auth)

    if(!user) return <Navigate to="/login"/>

    if(user?.role !== "admin"){
console.log(user?.role);

        toast.error("Admin Access Only!!!") 
        return <Navigate to = "/"/> ;
    }

  return children
}

export default ProtectRouter