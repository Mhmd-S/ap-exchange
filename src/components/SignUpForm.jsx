import {React, useEffect, useState, useRef} from 'react'
import { useAuth } from '../firebase/auth' 
import { useForm } from 'react-hook-form';

import Success from './Success';

const SignUpForm = ({ setSignUpShow}) => { // Fix the errors so they are seperated and do not show on the login and the signup

  const refErrors = useRef(null);

  const [passValue, setPassValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const { signUp, signUpErrors } = useAuth();

  const submitSignUp = (data) => {
      signUp(data.email,data.newPassword)
    };

  useEffect(()=>{
    if(signUpErrors && signUpErrors != 'none'){
      refErrors.current.innerText = signUpErrors;
    } else if(signUpErrors == 'none') {
      setShowSuccess(true);
    } else if(!showSuccess) {
      refErrors.current.innerText = '';
    }
  },[signUpErrors])

  return (
    <div className='absolute w-full h-full flex justify-center items-center bg-[#ffffffa8]'>
        {showSuccess ? <Success setSignUpShow={setSignUpShow} setWindowShow={setShowSuccess} /> :
        <form onSubmit={handleSubmit(submitSignUp)} className="w-1/3 h-3/5 mx-auto flex flex-col justify-between border-2 bg-[#ffffff] rounded-md p-4 relative shadow-md">
         
          <div className='w-full h-1/5 flex justify-between  items-center border-b-2 border-black'>
            <h3 className='text-4xl'>Sign Up</h3>
            <span className='text-2xl text-neutral-500 cursor-pointer' onClick={()=>setSignUpShow(false)}>x</span>
          </div>

          <div ref={refErrors} className='py-px text-lg text-red-500'></div>

          {/* Email Label and input */}
          <label className='hidden'>Email:</label>
          <input placeholder='Email' 
            type="text" 
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email", 
            { 
              required:"Email Address is required", 
              pattern:{ value:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, message:"Please enter a valid email"} 
            }
            )}
            className='border-[1px] border-[#C3ACD0] rounded-md text-lg p-1 bg-[#f5f6f7] focus:border-[#159aec] outline-none'/>
            {errors.email && <div className='py-px text-sm text-red-500'>{errors.email?.message}</div>}

          {/* Password label and input */}
          <label className='hidden'>New Password:</label>
          <input 
            placeholder='New Password' 
            type="password"
            value={passValue}
            {...register("newPassword", 
              {onChange:e=>setPassValue(e.target.value)},
              { 
                required:"Password is required",
                minLength:{value:6, message:"Password needs have atleast 6 characters" }
              }
            )}
            className='border-[1px] border-[#C3ACD0] rounded-md text-lg p-1 bg-[#f5f6f7] focus:border-[#159aec] outline-none'/>
            {errors.newPassword && <div className='py-px text-sm text-red-500'>{errors.newPassword?.message}</div>}
          
          {/* confirm password label and input */}
          <label className='hidden'>Confirm Password:</label>
          <input 
            placeholder='Confirm Password' 
            type="password" 
            {...register("confirmPassword", 
            { 
              required:"Password is required", 
              validate:{equalsPass: v => v == passValue || 'Passwords are not equal'},
              minLength:{value:6, message:"Password needs have atleast 6 characters" } 
            }
            )}
            className='border-[1px] border-[#C3ACD0] rounded-md text-lg p-1 bg-[#f5f6f7] focus:border-[#159aec] outline-none'/>
            {errors.confirmPassword && <div className='py-px text-sm text-red-500'>{errors.confirmPassword?.message}</div>}

          <button type='submit' className='w-1/3 text-white py-[.6rem] bg-[#3312d2] hover:bg-[#3815ec] self-center rounded-lg'>Sign Up</button>
      </form>
       }
    </div>  
  )
}

export default SignUpForm;


