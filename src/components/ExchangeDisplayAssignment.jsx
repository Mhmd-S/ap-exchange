import React, { useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf';
import { getFile } from '../firebase/storage';
import Spinner from './Spinner';  
import Success from './Success';
import { addDocToUserOwned, deductPointsFromUser, getUserOwnedDocs, getUserPoints } from '../firebase/firestore';

const ExchangeDisplayAssignment = ({ setAssignmentChosen, assignmentInfo, userID, displayButton }) => {

  const [ displayErrorsMessage, setdisplayErrorsMessage ] = useState(null);
  const [numPages, setNumPages] = useState(null); // Number of total pages
  const [isLoading, setIsLoading] = useState(true);
  const [ displaySuccess, setDisplaySuccess ] = useState(false);
  const [docArrayBuffer, setDocArrayBuffer] = useState(null); // Complete pdf doc array buffer

  useEffect(() => {
    getFile(assignmentInfo.previewBucket)
      .then(downloadURL => fetch(downloadURL))
      .then(response => response.arrayBuffer())
      .then(pdfBlob => setDocArrayBuffer(pdfBlob))
      .catch(error => console.log("Could not get file"))
      .finally(()=> setIsLoading(false))
  }, []);

  const handleExchangeClick = async() => {

    try{
      setIsLoading(true);
      const userPoints = await getUserPoints(userID);
      const userOwnedDocs = await getUserOwnedDocs(userID);
      const userHaveDoc = userOwnedDocs.includes(assignmentInfo.submissionID);
      if (userHaveDoc) {
        setdisplayErrorsMessage('Document Already Owned. Check your dashboard.');
      } else if (userPoints < 10) {
        setdisplayErrorsMessage('Not Enough Points');
      } else {
        await addDocToUserOwned(userID, assignmentInfo.submissionID);
        await deductPointsFromUser(userID, userPoints);
        setDisplaySuccess(true);
      }
    }
    catch(e){
      console.log(e)
    }
    finally{
      setIsLoading(false);
    }
  
  }

  return (
    <div className='w-full h-full overflow-hidden bg-[#e7e9ec] p-4 flex justify-between items-center absolute z-[2]'>
      { isLoading ? 
          <Spinner/> : 
          displaySuccess ? 
            <Success setDisplaySuccess={setDisplaySuccess} message='Success. You can view the document in your dashboard.'/> :
        <div className=' w-full h-full p-4 rounded-md shadow-sm bg-white grid grid-cols-[30%_70%] grid-rows-1 justify-items-center'>
          <div className='w-full h-1/7 px-4 py-2 flex flex-col'>
            <img src='/back.svg' alt='Go Back' className='w-[2rem] aspect-square cursor-pointer' onClick={()=>setAssignmentChosen(null)}/>
            {displayErrorsMessage && <p className='font-bold text-red-500'>{displayErrorsMessage}</p>}
            <h2 className='font-bold text-2xl'>{assignmentInfo.title}</h2>
            <h3 className='mt-4 font-semibold text-xl'>{assignmentInfo.courseName}</h3>
            <p className='mt-4 font-semibold text-xl'>{assignmentInfo.academicYear}</p>
            <p className='mt-4 break-words text-md'>{assignmentInfo.description}</p>
            {displayButton && <button onClick={handleExchangeClick} className='mt-10 px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-700 self-center'>Exchange For 10 Points</button>}
          </div>
          <Document
          className='max-h-full  w-fit overflow-y-scroll p-4  border-4 first-letter:rounded-lg bg-[#e7e9ec]'
            file={docArrayBuffer}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              {Array.from(new Array(numPages), (_, index) => ( // CLean this
                <Page /* In the future add a loading spinner */
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className='border-2 border-[#d4d6d8] mb-2'
                  />
              ))}
          </Document>
        </div>
  }
    </div>
  )
}

export default ExchangeDisplayAssignment