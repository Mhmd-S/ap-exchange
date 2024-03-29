import React, { useState, useEffect } from 'react'
import { uploadFile } from '../firebase/storage'
import { useForm } from 'react-hook-form';
import { useAuth } from '../firebase/auth';
import { addSubmission } from '../firebase/firestore';

import { useNavigate } from 'react-router-dom';

import Spinner from '../components/Spinner';
import Success from '../components/Success';
import Navigation from '../components/Navigation';

const SubmitPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true); 
  
  const [ isSubmitting, setIsSubmitting] = useState(false);
  const [ displaySuccess, setDisplaySuccess ] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { authUser, signOut, userAdmin } = useAuth();

  const onSubmitData = (data) => {
    setIsSubmitting(true);
    uploadFile(data.fileInput[0], authUser.uid).then((bucket)=>{
      addSubmission(authUser.uid, data.courseName, data.projectTitle, data.description, data.academicYear,bucket)
        .then(()=>{
          setDisplaySuccess(true);
          reset();
        })
        .catch((e)=>{
          console.log(e);
        });
        
    }).catch((e)=>{console.log(e)});
    setIsSubmitting(false);
  }

  useEffect(()=>{
    if(!authUser){
      navigate('/');
    }
    setIsLoading(false);
  },[authUser])

  return (
    <>
    {isLoading || isSubmitting ? <Spinner/> : displaySuccess ? <Success setDisplaySuccess={setDisplaySuccess} message='Success'/> : 
    <div className='w-full h-screen'>
      <Navigation userAdmin={userAdmin} signOut={signOut} authUser={authUser}/>
      
        <div className='w-full h-5/6 grid grid-cols-2 px-4 py-16 gap-10'> 
          <form onSubmit={handleSubmit(onSubmitData)}
                className='border-[#4f5e79] border-t-2 p-2 flex flex-col relative after:content-["Submit"] after:w-[1/5] after:absolute after:block after:-top-11 after:-left-1 after:bg-[#4f5e79] after:p-2 after:text-white after:text-xl'>
            
            {errors.courseName && <div className='self-center text-sm text-red-500'>{errors.courseName?.message}</div>}
            <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[30%_70%]'>
              <label>Course Name:</label>
              <input {...register("courseName", { required:"Course name is required", maxLength:{value:45, message:"Max length is 45 characters" }})} type='text' className='outline-none border-b-2 border-transparent focus:border-b-2 focus:border-blue-500'/>             
            </div>

            {errors.projectTitle && <div className='self-center pt-2 text-sm text-red-500'>{errors.projectTitle?.message}</div>}
            <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[30%_70%]'>
              <label>Project Title:</label>
              <input {...register("projectTitle", { required:"Project title is required", maxLength:{value:45, message:"Max length is 45 characters" }} )} type='text' className='outline-none border-b-2 border-transparent focus:border-b-2 focus:border-blue-500'/>
            </div>
            
            {errors.fileInput && <div className='self-center pt-2 text-sm text-red-500'>{errors.fileInput?.message}</div>}
            <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[30%_70%]'>
              <label>Upload Document:</label>
              <input {...register("fileInput", { required:"A PDF file is required"})} type='file' accept="application/pdf" className='outline-none border-b-2 border-transparent'/>
            </div>

            {errors.description && <div className='self-center pt-2 text-sm text-red-500'>{errors.description?.message}</div>}
            <div className='w-full  pl-10 py-4 border-b-2 grid grid-cols-[30%_70%]'>
              <label>Description:</label>
              <textarea {...register("description", { required:"Description is required", maxLength:{value:150, message:"Max length is 150 characters" }, minLength:{value:50, message:"Minimum legnth is 50 characters"}} )} type='text' className=' resize-none h-20 outline-none border-b-2 border-transparent focus:border-b-2 focus:border-blue-500'/>
            </div>

            {errors.academicYear && <div className='self-center pt-2 text-sm text-red-500'>{errors.academicYear?.message}</div>}
            <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[30%_70%]'>
              <label>Academic Year:</label>
              <input {...register("academicYear", { required:"academicYear is required"} )} type='text' className='outline-none border-b-2 border-transparent focus:border-b-2 focus:border-blue-500'/>
            </div>

            <p>{isSubmitting && "Submitting"}</p>

            <button type='submit' className='w-1/5 p-2 bg-blue-500 text-white rounded-md self-center mt-4'>Submit</button>
          </form>
          <div className='border-[#4f5e79] border-t-2 p-2 flex flex-col relative after:content-["Guide"] after:w-[1/5] after:absolute after:block after:-top-11 after:-left-1 after:bg-[#4f5e79] after:p-2 after:text-white after:text-xl'>
            <ul className='h-4/5 list-disc text-lg font-semibold flex flex-col justify-between'>
              <li>Fill in the form with the correct information.</li>
              <li>Before uploading the PDF, please be sure all personal information and lecturer's information are removed.</li>
              <li>Upload the PDF.</li>
              <li>Click on the sumbmit button.</li>
              <li>Your submission will be reviewed within 24 hours. If the review is successfull you will recieve the points.</li>
            </ul>
          </div>
        </div>

      </div>
    }
    </>
  )
}

export default SubmitPage