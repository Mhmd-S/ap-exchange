import React from 'react'

const HelpItem = ({helpIndex, setShowHelp}) => {
    const helpParagraphs = {
        1: {
            title: 'What is AP-Exchange',
            paragraph: 'Ap-Exchange is a platform where students can submit their old assigments in return for points and then exchange these points for other assignments.'
        },
        2: {
            title: 'What can I submit?',
            paragraph: 'You can submit any of your already graded assignmnets from any course.'
        },
        3: {
            title: 'Can I download the PDF?',
            paragraph: 'For safety reasons the assignments are only displayed in the browser by accessing your dashboard.'
        },
        4: {
            title: 'Contact Us',
            paragraph: 'For more information or to report any bugs/errors please send an email to BlaBla@gmail.com'
        } 
    }
  return (
    <div className='w-full h-full grid grid-rows-[20%_80%] justify-center items-center '>
        <div className='w-full h-full grid grid-cols-[5%_95%] text-xl border-b-2 justify-items-center items-center'>
            <span onClick={()=>setShowHelp(null)} className='cursor-pointer text-gray-300 '>{'<'}</span>
            <span className='text-center w-full'>{helpParagraphs[helpIndex].title}</span>
        </div>
        <p className='p-4 text-center w-full h-full'>{helpParagraphs[helpIndex].paragraph}</p>
    </div>
  )
}

export default HelpItem