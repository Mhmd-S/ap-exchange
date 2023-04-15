import React, { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import Spinner from '../components/Spinner'
import { useAuth } from '../firebase/auth';
import HelpItem from '../components/HelpItem';
import { useNavigate } from 'react-router-dom';

const Help = () => {
    const navigate = useNavigate();
    const { isLoading, authUser } = useAuth();
    const [ showHelp, setShowHelp ] = useState(null);

    useEffect(()=>{
        if (!authUser) {
            navigate('/');
            return;
          }
    })

    const handleHelpClick = (helpIndex) => {
        setShowHelp(<HelpItem helpIndex={helpIndex} setShowHelp={setShowHelp}/>)
    }

  return (
    <div className='w-full h-screen'>
        {isLoading ? <Spinner/>
        : <>
            <Navigation/>
            <div className='relative w-full h-5/6 flex flex-col'>
                <h1 className='w-full text-4xl font-extrabold pl-[15%] pt-8 pb-2 underline'>AP-Exchange</h1>
                <h2 className='w-full text-3xl text-bold pl-[15%] pb-10'>F.A.Q</h2>
                <div className='w-1/2 h-1/2 border-2 rounded-lg self-center p-4 '>
                { showHelp ?  
                    showHelp 
                    :
                    <ul className='w-full h-full flex flex-col justify-between'>
                        <li className='rounded-md cursor-pointer transition-all hover:bg-[#f0f2f5] p-2 flex justify-between'
                            onClick={(()=>handleHelpClick(1))}>What is AP-Exchange? <span>{'>'}</span></li>
                        <li className='rounded-md cursor-pointer transition-all hover:bg-[#f0f2f5] p-2 flex justify-between'
                            onClick={(()=>handleHelpClick(2))}>What can I submit?<span>{'>'}</span></li>
                        <li className='rounded-md cursor-pointer transition-all hover:bg-[#f0f2f5] p-2 flex justify-between'
                            onClick={(()=>handleHelpClick(3))}>Can I download the PDF?<span>{'>'}</span></li>
                        <li className='rounded-md cursor-pointer transition-all hover:bg-[#f0f2f5] p-2 flex justify-between'
                            onClick={(()=>handleHelpClick(4))}>Contact Us<span>{'>'}</span></li>
                    </ul>}
                </div>
            </div>
          </>
        }
    </div>
  )
}

export default Help