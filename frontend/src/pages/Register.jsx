import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useRegisterMutation } from '../redux/features/authApi';
import { useNavigate } from 'react-router-dom';


const Register = () => {


    const [register, {isLoading, error, data}] = useRegisterMutation()
    const navigate = useNavigate()

    const [user, setUser] = useState({
        name:"",
        email:"",
        password:""
    })

  const {name, email, password} = user;
  
  useEffect(() => {
    if(error){
        toast.error(error?.data?.message);
    }
    if(data){
        toast.success("Wait for admin permit")
        navigate("/login")
    }
  }, [error,data]);
  
  const submitHandler = (e) => {
    
    e.preventDefault();

    const signUpData = {
        name, 
        email,
        password
    }

    // console.log(signUpData);

    register(signUpData);

  }

  const onChange = (e) => {

    setUser({...user, [e.target.name]: e.target.value});
    
  }



  return (
    <div className='grid place-items-center min-h-screen bg-gray-100'>
    
      <div className='bg-white p-6 rounded-xl shadow-lg w-80'>
        <form onSubmit={submitHandler} className='flex flex-col gap-4'>
          <h2 className='text-2xl font-semibold text-center'>Register</h2>

          <div className='flex flex-col'>
            <label htmlFor="name" className='text-gray-700 mb-1'>Name</label>
            <input
              type="text"
              id='name'
              name='name'
              value={name}
              onChange={onChange}
              className='w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor="email_field" className='text-gray-700 mb-1'>Email</label>
            <input
              type="email"
              id='email_field'
              name='email'
              value={email}
              onChange={onChange}
              className='w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor="password_field" className='text-gray-700 mb-1'>Password</label>
            <input
              type="password"
              id='password_field'
              name='password'
              value={password}
              onChange={onChange}
              className='w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition'
          >
            {isLoading ? "Creating..." : "Register"}
          </button>

          <p className='text-sm text-center'>
            Already have an account?{" "}
            <a href="/login" className='text-blue-500 hover:underline'>
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register