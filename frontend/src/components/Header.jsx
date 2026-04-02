import React from 'react'
import { useGetMeQuery } from '../redux/features/userApi'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const {data ,isLoading} =useGetMeQuery()
  const navigate = useNavigate()
  function handleClick(){
    navigate("/")
  }
  return (
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold"
        onClick={()=>handleClick()}
        >OpsMind AI</h2>
      </div>
  )
}

export default Header