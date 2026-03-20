import React from 'react'
import { useDeleteDocsMutation, useGetAllDocsQuery } from '../redux/features/docs';

const DocsLog = () => {
    const {data,isloading,error}= useGetAllDocsQuery();
    const [deleteSop] = useDeleteDocsMutation(); 
    console.log(data, isloading,error);

    function handleDelete(file){

      deleteSop({
        file 
      })
    }

    if(isloading) return
    const d = [1,2,3]
  return (
    <div>
        <h1 className='font-semibold text-xl mb-3'>Docs Uploads</h1>
        <div>
            {data?.data.map((val,key)=>(
                <div key={key} className='flex justify-between bg-amber-200 px-3 py-2 items-center rounded-xl shadow-md mb-4'>
                <h2 >{val?.documentName}</h2>
                <button className='py-1 px-2 bg-red-500 rounded-md text-white'
                onClick={()=>handleDelete(val.documentName)}
                >delete</button>
            </div>
            ))}
            
        </div>
    </div>
  )
}

export default DocsLog