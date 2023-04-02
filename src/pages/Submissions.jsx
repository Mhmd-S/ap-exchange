import React from 'react'
import { useEffect, useState } from 'react';

import Navigation from '../components/Navigation';

const Submissions = () => {

    useEffect(()=>{

    },[])

  return (
    <div className='w-full'>
        <Navigation/>
        <ul className='w-full flex flex-col justify-center items-center py-6'>
            <li className='w-1/2 py-6 flex justify-evenly items-center rounded-md shadow-lg cursor-pointer transition-all hover:bg-[#f0f2f5]'>
                <img src='./acceptedLogo.svg' alt='Confirmed' className='w-1/6'/>
                <div>
                    <h5>Title: System Acrh</h5>
                    <h6>Course Name: Bla bla</h6>
                    <p>Date: 12/08/2023</p>
                </div>
            </li>
            <li className='w-1/2 py-6 flex justify-evenly items-center rounded-md shadow-lg cursor-pointer transition-all hover:bg-[#f0f2f5]'>
                <img src='./rejectLogo.svg' alt='Confirmed' className='w-1/6'/>
                <div>
                    <h5>Title: System Acrh</h5>
                    <h6>Course Name: Bla bla</h6>
                    <p>Date: 12/08/2023</p>
                </div>
            </li>
            <li className='w-1/2 py-6 flex justify-evenly items-center rounded-md shadow-lg cursor-pointer transition-all hover:bg-[#f0f2f5]'>
                <img src='./warningLogo.svg' alt='Confirmed' className='w-1/6'/>
                <div>
                    <h5>Title: System Acrh</h5>
                    <h6>Course Name: Bla bla</h6>
                    <p>Date: 12/08/2023</p>
                </div>
            </li>
            <li className='w-1/2 py-6 flex justify-evenly items-center rounded-md shadow-lg cursor-pointer transition-all hover:bg-[#f0f2f5]'>
                <img src='./reviewLogo.svg' alt='Confirmed' className='w-1/6'/>
                <div>
                    <h5>Title: System Acrh</h5>
                    <h6>Course Name: Bla bla</h6>
                    <p>Date: 12/08/2023</p>
                </div>
            </li>
        </ul>
    </div>
  )
}

export default Submissions;