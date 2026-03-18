import React from 'react'
import { useGetAllUserQuery } from '../redux/features/adminApi';


const UserLog = () => {
    const {data,isloading,error}= useGetAllUserQuery()
    console.log(data, isloading,error);

    if(isloading) return
    const d = [1,2,3]
  return (
    <div>
        <h1 className='font-semibold text-xl mb-3'>Users Logs</h1>
        <div>
            {data?.users?.map((val,key)=>(
                <div key={key} className='flex justify-between bg-amber-200 px-3 py-2 items-center rounded-xl shadow-md mb-4'>
                <h2>{val?.name}</h2>
                <button className='py-1 px-2 bg-amber-600 rounded-md'>delete</button>
            </div>
            ))}
            
        </div>
    </div>
  )
}

export default UserLog