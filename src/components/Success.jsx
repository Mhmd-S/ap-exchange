import React from 'react'

const Success = ({ setDisplaySuccess, parentCompShow,message}) => {

  const handleOnClick = () => {
    setDisplaySuccess(false)
    if (parentCompShow !== undefined){
      parentCompShow(false)
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='w-2/5 h-2/5 mx-auto flex flex-col justify-between items-center border-2 bg-[#ffffff] rounded-md p-4 relative shadow-md'>
          <img className='w-1/5 aspect-square' src='/checkMark.svg' alt='Success'/>
          <p className='text-xl'>{message}</p>
          <button 
            onClick={handleOnClick} 
            className='w-1/3 text-white text-xl py-[.6rem] bg-[#3312d2] hover:bg-[#3815ec] self-center rounded-lg'>Done</button>
      </div>
    </div>
  )
}

export default Success