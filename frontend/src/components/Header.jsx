import React from 'react'
import { useGetMeQuery } from '../redux/features/userApi'

const Header = () => {
  const {data ,isLoading} =useGetMeQuery()
  return (
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">OpsMind AI</h2>
      </div>
  )
}

export default Header