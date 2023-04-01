import {React, useState, useEffect, useRef} from 'react'
import {useAuth} from '../firebase/auth'
import { useForm } from 'react-hook-form';
import Success from './Success';

const ForgotPassword = ({ setResetShow }) => {
    const refErrors = useRef(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { resetPassword , resetError } = useAuth();
    const [ showSuccess, setShowSuccess ] = useState(false);

    const onSubmit = (data) => {
      resetPassword(data.email)
    }

    useEffect(()=>{
      if(resetError && resetError != 'none'){
        refErrors.current.innerText = resetError;
      } else if (resetError == 'none') {
        setShowSuccess(true);
      } else {
        refErrors.current.innerText = '';
      }
    },[resetError])

  return (
    <div className='absolute w-full h-full flex justify-center items-center bg-[#ffffffa8]'>
        {showSuccess ? <Success setShowSuccess={setShowSuccess} setWindowShow={setResetShow} /> :
        <form onSubmit={handleSubmit(onSubmit)} className='w-1/3 h-3/5 mx-auto flex flex-col justify-start items-center border-2 bg-[#ffffff] rounded-md p-4 shadow-md'>
            
            <div className='w-full h-fit flex justify-between py-2 items-center border-b-2 border-black'>
                <h3 className='text-4xl'>Reset Password</h3>
                <span className='text-2xl text-neutral-500 cursor-pointer' onClick={()=>setResetShow(false)}>x</span>
            </div>
            <div ref={refErrors} className='py-px text-lg text-red-500'></div>
            <label className='pt-[15%] pb-2 text-xl underline'>Please enter your email address:</label>
            <input placeholder='Email' 
                type="text" 
                aria-invalid={errors.email ? "true" : "false"}
                {...register("email", 
                { 
                  required:"Email Address is required", 
                  pattern:{ value:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, message:"Please enter a valid email"} 
                }
                )}
                className='border-[1px] w-[90%] border-[#C3ACD0] rounded-md text-lg p-2 bg-[#ffffff] focus:border-[#159aec] outline-none'
            />
            {errors.email && <div className='py-px text-sm text-red-500'>{errors.email?.message}</div>}

            <button type='submit' className="w-[45%] mt-[20%] text-center text-white font-medium h-fit p-2 bg-lime-600 hover:bg-lime-700 self-center  rounded-md cursor-pointer">Send Reset Email</button>
        </form>
        }
    </div>
  )
}

export default ForgotPassword;