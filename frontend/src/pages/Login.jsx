import React, { useEffect, useState } from 'react'

import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../redux/features/authApi';
import Header from '../components/Header';


const Login = () => {
  const navigate = useNavigate()
  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState(""); 

  const [login, {data,isLoading,error}] = useLoginMutation()
  
  console.log(data,error,isLoading);

  useEffect(() => {
    if(error){
        
        toast.error(error?.data?.message);
    }
    if(data){
      toast.success("Logged Sucessfully")
      navigate("/")
    }
  }, [error,data]);
  
  const submitHandler = async(e) => {
    e.preventDefault();

    if(email && password){
        const loginData = {
          email,
          password
      }

      await login(loginData);
      
      
    }else{
      
      toast.error('Enter the Credentials')
    }

    if(data){
      navigate("/")
    }
  
  }


  return (
    
<div className='grid place-items-center min-h-screen bg-gray-100'>
  {/* <Header/> */}
  <div className='bg-white p-6 rounded-xl shadow-lg w-80'>
    
    <form onSubmit={submitHandler} className='flex flex-col gap-4'>
      
      <h2 className='text-2xl font-semibold text-center'>Login</h2>

      <div className='flex flex-col'>
        <label htmlFor="email_field" className='text-gray-700 mb-1'>
          Email
        </label>
        <input
          type="email"
          id='email_field'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>


      <div className='flex flex-col'>
        <label htmlFor="password_field" className='text-gray-700 mb-1'>
          Password
        </label>
        <input
          type="password"
          id='password_field'
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <a href="/password/forgot" className='text-sm text-blue-500 hover:underline text-right'>
        Forgot password?
      </a>

      <button
        type='submit'
        // disabled={isLoading}
        className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition'
      >
        {isLoading ? "Loading..." : "Login"}
      </button>

      <p className='text-sm text-center'>
        New user?{" "}
        <a href="/register" className='text-blue-500 hover:underline'>
          Register
        </a>
      </p>

    </form>
  </div>
</div>
  )
}

export default Login