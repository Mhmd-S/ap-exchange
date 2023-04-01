import {React, useState, useEffect, useRef} from 'react'
import {useAuth} from '../firebase/auth'
import { useForm } from 'react-hook-form';


const LogInForm = ({ setSignUpShow, setResetShow}) => {

  const refErrors = useRef(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const { signIn, logInErrors } = useAuth();

  const onSubmit = (data) => { // Fix this, look at the mvp example maybe useEffect will help?
      signIn(data.email,data.password);
    };  

  useEffect(()=>{
    if(logInErrors && logInErrors != 'none'){
      refErrors.current.innerText = logInErrors;
    } else {
      refErrors.current.innerText = '';
    }
  },[logInErrors])

  return ( // Should we change it to just one form??? but think about scalability
    <div className='relative w-[45%] h-full flex justify-center items-center'>    
        <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 h-1/2 flex flex-col justify-between shadow-md border-2 bg-[#ffffff] rounded-md p-4 relative">
            <div ref={refErrors} className='py-px text-lg text-red-500'></div>
            <label className='hidden'>Email:</label>
            <input 
            placeholder='Email' 
            aria-invalid={errors.email ? "true" : "false"} 
            type="text" 
            className='border-2 shadow-inner rounded-md text-lg p-2 focus:border-[#159aec] outline-none' 
            {...register("email", { required:"Email Address is required", pattern:{ value:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, message:"Please enter a valid email"} })}/>
            {errors.email && <div className='py-px text-sm text-red-500'>{errors.email?.message}</div>}
            
            <label className='hidden'>Password:</label>
            <input 
              placeholder='Password' 
              aria-invalid={errors.password ? "true" : "false"} 
              type="password" 
              className='border-2 shadow-inner rounded-md text-lg p-2 focus:border-[#159aec] outline-none' 
              {...register("password", { required:"Password is required"})}/>
            {errors.password && <div className='py-px text-sm text-red-500'>{errors.password?.message}</div>}
            
            <button type='submit'
            className='w-full text-white font-medium py-[.6rem] bg-[#2a83ff] hover:bg-[#3373cd] self-center rounded-lg '>
              Log In
            </button>
            
            <div onClick={()=>setResetShow(true)} className='w-fit text-center text-sm text-[#2a83ff] cursor-pointer self-center hover:underline'>Forgot Password?</div>
            <hr/>
            <div onClick={()=>setSignUpShow(true)} className="w-[30%] text-center text-white font-medium h-fit p-2 bg-lime-600 hover:bg-lime-700 self-center  rounded-md cursor-pointer">Sign Up</div>
        
        </form>
</div>  
  )
}

export default LogInForm