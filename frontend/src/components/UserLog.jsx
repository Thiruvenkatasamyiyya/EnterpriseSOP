import React from 'react'
import { useGetAllUserQuery, usePermitUserMutation } from '../redux/features/adminApi';


const UserLog = () => {
    const {data,isloading,error}= useGetAllUserQuery()
    console.log(data, isloading,error);
    const [permitAccess,{error : perror, data : pdata}] = usePermitUserMutation();
    console.log(perror,pdata);
    
    if(isloading) return

    function handleAction(id,action){
      permitAccess({
        id,
        action
      })
    }
    const d = [1,2,3]
  return (
    <div>
        <h1 className='font-semibold text-xl mb-3'>Users Logs</h1>
        <div className=''>
            {data?.users?.map((val,key)=>(
                <div key={key} className='flex justify-between bg-gray-100 px-3 py-2 items-center rounded-xl shadow-md mb-4'>
                <div>
                  <h2>{val?.name}</h2>
                  <h2>{val?.email}</h2>
                  <p>{val?.createdAt.slice(0,10)}</p>
                    <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30">{val?.access}</span>
                  
                </div>
                <div className='flex flex-col gap-2'>
                  <button className='py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white  rounded-md'onClick={()=>handleAction(val._id,"approved")}>Allow</button>
                  <button className='py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md'onClick={()=>handleAction(val._id,"rejected")}>Reject</button>
                </div>
            </div>
            ))}
            
        </div>
    </div>
  )
}

export default UserLog