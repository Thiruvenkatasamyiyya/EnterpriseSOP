import React from 'react'

const SideBar = () => {
  return (
    <div className=" bg-blue-900 h-screen p-4 flex flex-col justify-between text-white">
        <div>
            <h1 className=' text-2xl font-bold '>SOP Agent</h1>
            <hr className='border-white my-5' />
        </div>
        <div>
            <h1>LogIn</h1>
        </div>
      </div>
  )
}

export default SideBar