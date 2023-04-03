import React, { useEffect } from 'react'

const SubmissionItem = ({ data }) => {

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
    <li className='w-1/2 py-6 flex justify-evenly items-center rounded-md shadow-lg cursor-pointer transition-all hover:bg-[#f0f2f5]'>
                <img src={displayLogoStatus(data.status)[0]} alt={data.status} className='w-1/6'/>
                <div>
                    <h5>Title: {data.title}</h5>
                    <h6>Course Name: {data.courseName}</h6>
                    <p>Date: {data.date}</p>
                    <p>Status: {displayLogoStatus(data.status)[1]}</p>
                    <p>{data.status in ['rejected', 'warning'] && 'Click to learn more.'}</p>
                </div>
            </li>
  )
}

export default SubmissionItem