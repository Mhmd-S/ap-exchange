import React, {useState} from 'react'
import { useForm } from 'react-hook-form';
import { changeToPendingReview } from '../firebase/firestore';
import { uploadFile } from '../firebase/storage';
import { useAuth } from '../firebase/auth';
import Success from './Success';

const SubmissionUserView = ({ submissionInfo, setSubmissionShow }) => {

    const { authUser } = useAuth();

    const [ isSubmitting, setIsSubmitting] = useState(false);
    const [ displaySuccess, setDisplaySuccess ] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmitData = (data) => {
        setIsSubmitting(true);
        uploadFile(data.fileInput[0], authUser.uid).then((bucket)=>{
            console.log(submissionInfo)
          changeToPendingReview(submissionInfo.id, data.courseName, data.projectTitle,bucket)
          .then(()=>{
            setDisplaySuccess(true);
            reset();
            })
        }).catch((e)=>{console.log(e)});
        setIsSubmitting(false);
    }

    return (
    <>
        {displaySuccess ? <Success setDisplaySuccess={setDisplaySuccess} message='Success'/> :
        <div className='w-full flex justify-evenly'>
            <div className='w-2/5 border-[#4f5e79] border-t-2 p-2 mt-20 ml-20 flex flex-col break-words relative after:content-["Fix\a0Tab"] after:w-[1/5] after:absolute after:block after:-top-11 after:left-0 after:bg-[#4f5e79] after:p-2 after:text-white after:text-xl'>
                <p className='break-words border-b-2 py-4'>Course Name: {submissionInfo.courseName}</p>
                <p className='break-words border-b-2 py-4'>Project Title: {submissionInfo.title}</p>
                <p className='border-b-2 py-4'>Status: {submissionInfo.status}</p>
                <p className='border-b-2 py-4'>Message from Reviewer: {submissionInfo.message}</p>
          </div>

        {submissionInfo.status === 'fix' &&
          <form onSubmit={handleSubmit(onSubmitData)}
                className='w-2/5 border-[#4f5e79] border-t-2 p-2 mt-20  flex flex-col relative after:content-["Fix\a0Tab"] after:w-[1/5] after:absolute after:block after:-top-11 after:left-0 after:bg-[#4f5e79] after:p-2 after:text-white after:text-xl'>

            {errors.courseName && <div className='self-center text-sm text-red-500'>{errors.courseName?.message}</div>}
            <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[25%_75%]'>
              <label>Course Name:</label>
              <input {...register("courseName", { required:"Course name is required"})} type='text' className='outline-none border-b-2 border-transparent focus:border-b-2 focus:border-green-500'/>
              
            </div>
            {errors.projectTitle && <div className='self-center pt-2 text-sm text-red-500'>{errors.projectTitle?.message}</div>}
            <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[25%_75%]'>
              <label>Project Title:</label>
              <input {...register("projectTitle", { required:"Project title is required"})} type='text' className='outline-none border-b-2 border-transparent focus:border-b-2 focus:border-green-500'/>
              
            </div>
            {errors.projectTitle && <div className='self-center pt-2 text-sm text-red-500'>{errors.projectTitle?.message}</div>}
            <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[30%_70%]'>
              <label>Upload Document:</label>
              <input {...register("fileInput", { required:"A PDF file is required"})} type='file' accept="application/pdf" className='outline-none border-b-2 border-transparent'/>
              
            </div>
            
            <p>{isSubmitting && "Submitting"}</p>

            <button type='submit' className='w-1/5 p-2 bg-green-500 text-white rounded-md self-center mt-4'>Fix</button>
          </form>
        }
          
          <img src='./close.svg' alt='Go Back' className='w-[2.8rem] mt-5 pr-4 self-start cursor-pointer' onClick={()=>setSubmissionShow(null)}/>
        </div>
    }
      </>
    )
}

export default SubmissionUserView