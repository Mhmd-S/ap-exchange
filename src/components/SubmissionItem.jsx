import React, { useEffect } from 'react'

const SubmissionItem = ({ submissionInfo, handleOnClick }) => {
    const displayLogoStatus = (status) => {
        if(status === 'review'){
            return ['./reviewLogo.svg', 'Waiting For Review'];
        } else if (status === 'rejected') {
            return ['./rejectLogo.svg', 'Rejected'];
        } else if (status === 'accepted'){
            return ['./acceptedLogo.svg', 'Accepted. You have recieved your points!'];
        } else {
            return ['./warningLogo.svg', 'Waiting For Fixes'];
        }
    }

  return (
    <li onClick={handleOnClick ? ()=>handleOnClick(submissionInfo) : ()=>{}} className='w-1/2 h-full py-6 grid grid-cols-[30%_70%] justify-evenly items-center rounded-md shadow-lg cursor-pointer transition-all hover:bg-[#f0f2f5]'>
        <img src={displayLogoStatus(submissionInfo.status)[0]} alt={submissionInfo.status} className='w-1/2 justify-self-center'/>
        <div className='w-4/5 flex flex-col justify-self-start'>
                <h5 className='truncate'>Title: {submissionInfo.title}</h5>
                <h6 className='truncate'>Course Name: {submissionInfo.courseName}</h6>
                <p>Date: {submissionInfo.dateSubmitted.toDate().toDateString()}</p>
                <p>Status: {displayLogoStatus(submissionInfo.status)[1]}</p>
                <p>{(submissionInfo.status === "rejected" || submissionInfo.status === "fix")  && 'Click to learn more.'}</p>
        </div>
    </li>
  )
}

export default SubmissionItem