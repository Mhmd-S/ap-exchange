import React from 'react'

const Spinner = () => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center absolute'>
       <svg className="w-1/3 animate-spin" viewBox="0 0 50 50">
         <circle className="w-fit" strokeDasharray="30" strokeDashoffset="100  " cx="25" cy="25" r="5" fill="none" stroke='#fff' strokeLinecap="round" strokeWidth="1"></circle>
         <circle className="w-fit" strokeDasharray="25" cx="25" cy="25" r="5" fill="none" stroke='#000' strokeWidth="1"></circle>
        </svg>
    </div>
  )
}

export default Spinner