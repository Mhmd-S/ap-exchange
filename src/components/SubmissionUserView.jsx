import React, {useState} from 'react'
import { useForm } from 'react-hook-form';
import { changeToPendingReview } from '../firebase/firestore';
import { uploadFile } from '../firebase/storage';
import { useAuth } from '../firebase/auth';
import Success from './Success';
import Spinner from './Spinner';

const SubmissionUserView = ({ submissionInfo, setSubmissionShow, userSubmissionsJSX }) => {

    const { authUser } = useAuth();

    const [ isSubmitting, setIsSubmitting] = useState(false);
    const [ displaySuccess, setDisplaySuccess ] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmitData = (data) => {
        setIsSubmitting(true);
        uploadFile(data.fileInput[0], authUser.uid).then((bucket)=>{
          changeToPendingReview(submissionInfo.id, data.courseName, data.projectTitle, bucket, data.description, data.academicYear)
          .then(()=>{
            userSubmissionsJSX();
            setSubmissionShow(null);
            reset();
            })
        }).catch((e)=>{console.log(e)});
        setIsSubmitting(false);
    }

    return (
    <div className='w-full h-full absolute z-[1] bg-[#0000005f] flex justify-center items-center top-[0%]'>
      <div className='w-5/6 h-5/6 shadow-inner bg-white rounded-md'>
          {displaySuccess ? <Success setDisplaySuccess={setDisplaySuccess} parentCompShow={setSubmissionShow} message='Success'/> :
          <div className={'w-full h-full grid' + (submissionInfo.status === 'fix' ? ' grid-cols-[45%_45%_5%] p-2 ' : ' grid-cols-[95%_5%] pl-[5%] ') + 'grid-rows-1 justify-center items-center justify-items-center    gap-2'}>

              <div className='w-full h-full border-[#4f5e79] top-[15%] border-t-2 flex flex-col break-words relative after:content-["Details"] after:w-[1/5] after:absolute after:block after:-top-11 after:left-0 after:bg-[#4f5e79] after:p-2 after:text-white after:text-xl'>
                  <p className='break-words border-y-2 py-4 pl-10 border-t-transparent'>Course Name: {submissionInfo.courseName}</p>
                  <p className='break-words border-y-2 py-4 pl-10 border-t-transparent'>Project Title: {submissionInfo.title}</p>
                  <p className='border-y-2 py-4 pl-10 border-t-transparent'>Status: {submissionInfo.status}</p>
                  <p className='border-y-2 py-4 pl-10 border-y-transparent'>Message from Reviewer: {submissionInfo.message}</p>
              </div>

          {submissionInfo.status === 'fix' &&
            <form onSubmit={handleSubmit(onSubmitData)}
                  className='w-full h-full border-[#4f5e79] border-t-2 top-[15%] flex flex-col relative after:content-["Fix\a0Tab"] after:w-[1/5] after:absolute after:block after:-top-11 after:left-0 after:bg-[#4f5e79] after:p-2 after:text-white after:text-xl'>

              {errors.courseName && <div className='self-center text-sm text-red-500'>{errors.courseName?.message}</div>}
              <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[30%_70%]'>
                <label>Course Name:</label>
                <input defaultValue={submissionInfo.courseName} {...register("courseName", { required:"Course name is required"})} type='text' className='outline-none border-b-2 border-transparent focus:border-b-2 focus:border-green-500'/>
              </div>

              {errors.projectTitle && <div className='self-center pt-2 text-sm text-red-500'>{errors.projectTitle?.message}</div>}
              <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[30%_70%]'>
                <label>Project Title:</label>
                <input defaultValue={submissionInfo.title} {...register("projectTitle", { required:"Project title is required"})} type='text' className='outline-none border-b-2 border-transparent focus:border-b-2 focus:border-green-500'/>
              </div>

              {errors.academicYear && <div className='self-center pt-2 text-sm text-red-500'>{errors.academicYear?.message}</div>}
              <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[30%_70%]'>
                <label>Academic Year:</label>
                <input defaultValue={submissionInfo.academicYear} {...register("academicYear", { required:"Academic Year is required"})} type='text' className='outline-none border-b-2 border-transparent focus:border-b-2 focus:border-green-500'/>
              </div>

              {errors.description && <div className='self-center pt-2 text-sm text-red-500'>{errors.description?.message}</div>}
            <div className='w-full  pl-10 py-4 border-b-2 grid grid-cols-[30%_70%]'>
              <label>Description:</label>
              <textarea defaultValue={submissionInfo.description} {...register("description", { required:"Description is required", maxLength:{value:150, message:"Max length is 150 characters" }, minLength:{value:50, message:"Minimum legnth is 50 characters"}} )} type='text' className=' resize-none h-20 outline-none border-b-2 border-transparent focus:border-b-2 focus:border-green-500'/>
            </div>

              {errors.projectTitle && <div className='self-center pt-2 text-sm text-red-500'>{errors.projectTitle?.message}</div>}
              <div className='w-full pl-10 py-4 border-b-2 grid grid-cols-[50%_50%]'>
                <label>Upload Document:</label>
                <input {...register("fileInput", { required:"A PDF file is required"})} type='file' accept="application/pdf" className='outline-none border-b-2 border-transparent text-sm '/>
              </div>

              <p>{isSubmitting && "Submitting"}</p>

              <button type='submit' className='w-1/5 p-2 bg-green-500 text-white rounded-md self-center mt-4'>Fix</button>
            </form>
          }

            <img src='./close.svg' alt='Go Back' className='w-[2.8rem] mt-5 pr-4 self-start cursor-pointer' onClick={()=>setSubmissionShow(null)}/>
          </div>
      }
        </div>
    </div>
    )
}

export default SubmissionUserView