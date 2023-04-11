import React, { useEffect, useState } from 'react';

import { Document, Page, pdfjs } from 'react-pdf';
import jsPDF from 'jspdf';

import { addVerifeidFile, getFile, deleteFromStorage } from '../firebase/storage';
import { acceptSubmission, changeToCompleteRejection, changeToPendingFix } from '../firebase/firestore';
import Success from './Success';
import Spinner from './Spinner';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Review = ({submission, nextSubmissionJSX}) => {

  const [ numPages, setNumPages ] = useState(null); // Number of total pages
  const [ docArrayBuffer , setDocArrayBuffer ] = useState(null); // Complete pdf doc array buffer
  const [ pageList, setPageList ] = useState({}); // The pages that will be used as preview.
  const [ acceptMode, setAcceptMode ] = useState(true); // Describes if the user is going to reject or accept the submission
  
  const [ input, SetInput ] = useState('');
  const [ inputErrors, setInputErrors ] = useState('');

  
  const [ isLoading, setIsLoading ] = useState(true);

  const handlePageClick = (pageNum, canvas) => { // Handles the action of clicking a page on the pdf viewer.

    let listCopy = {...pageList};

    // Checks if the paper is already selected. Removes it if already selected, adds the paper if not found in the list.
    pageNum in listCopy ? delete listCopy[pageNum] : listCopy[pageNum] = canvas; 

    // THe keys are the page number of the paper.
    let keys = Object.keys(listCopy); 

    keys.sort((a, b) => a - b); // Sorts the pages.

    let sortedObj ={};

    // Uses the sorted keys to sort the pageLsit object.
    keys.forEach(function(key) {
      sortedObj[key] = listCopy[key];
    });

    setPageList(sortedObj);
  }

  const handleCompleteRejectiong = () =>{
    changeToCompleteRejection(submission.submissionID,input);
    deleteFromStorage(submission.bucket);
    nextSubmissionJSX();
  }

  const handlePendingFix = () =>{
    deleteFromStorage(submission.bucket);
    changeToPendingFix(submission.submissionID,input);
    nextSubmissionJSX();
  }

  const onSubmitValidAssignmnet = async() => {

    if (input === '') {
      setInputErrors('Course Name can not be empty');
      return;
    } else if ( Object.keys(pageList).length === 0) {
      setInputErrors('No Pages are selected as previews');
      return;
    }

    const docPreview = new jsPDF();
    // This block of code gets the selected pages from the pdf and creates a new pdf with the selected.
    Object.keys(pageList).map(page =>{
      docPreview.insertPage(page);
      docPreview.addImage(pageList[page], -12.5,0);

    })
    // Uploads the preview pdf file to the storage.
    try {
      // Uploads the completed file to the completed folder storage in the storage.
      setIsLoading(true);
      const completedBucket = await addVerifeidFile(docArrayBuffer, input, true);
      // Uploads the preview file to the preview folder in the storage.
      const docPrevArrayBuffer = docPreview.output('arraybuffer')
      const previewBucket = await addVerifeidFile(docPrevArrayBuffer, input, false);
      // Adds the data related to the confirmed submission to the firestore.
      await acceptSubmission(submission.submissionID,input,submission.title,completedBucket,previewBucket);
      deleteFromStorage(submission.bucket);
      setIsLoading(false);
      nextSubmissionJSX();
    } catch(e) {
      console.log(e);
    }
  }

  // Gets the document's URL from the storage and URL in the state.
  useEffect(()=>{
    console.log(submission.bucket)
    getFile(submission.bucket)
      .then(downloadURL => fetch(downloadURL))
      .then(response => response.arrayBuffer())
      .then(pdfBlob => setDocArrayBuffer(pdfBlob))
      .catch(error => console.log("Could not get file"));
      setIsLoading(false);
  },[])

  return (
    <>
    {isLoading ? <Spinner/> : 
    <div className='w-full h-screen rounded-md mx-auto  px-4 flex justify-between items-center'>
        <div className='w-[40%] h-full px-2'>
          
          <div className='w-full h-2/6 border-b-2 py-4'>
            {/* <img src='/back.svg' alt='Go Back' className='w-[2rem] aspect-square cursor-pointer' onClick={()=>setViewingInfo(false)}/> */}
            <p className='mt-2'><span className='font-bold'>Course Name:</span> {submission.courseName}</p>
            <p><span className='font-bold'>Assignment Title:</span> {submission.title}</p>
            <p><span className='font-bold'>Academic Year:</span> {submission.academicYear}</p>
            {/* <p><span className='font-bold'>User UID:</span> {submission.uid}</p> */}
            <p className='break-words'><span className='font-bold'>Description:</span> {submission.description}</p>
            {submission.message && <p>Previous Message: {submission.message}</p>}
          </div>
          
          <div className='w-full h-4/6 flex flex-col'>
            {/* Slider button start */}
            <div className='w-1/2 h-[10%] flex justify-between items-center my-4 self-center text-center'>
              
              <div className=" text-gray-700 font-medium ">Accept</div>
              
              <div className="relative cursor-pointer" onClick={()=>setAcceptMode(!acceptMode)}>
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className={(!acceptMode ? "translate-x-full " : "") + "absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all"}></div>
              </div>
              
              <div className="text-gray-700 font-medium">Reject</div>            
           
            </div>
            {/* Slider button end */}
            
            {acceptMode && <h5 className='w-full font-bold text-center text-red-500 '>{inputErrors}</h5>}

            {acceptMode && <p>Pages to be used as previews: {Object.keys(pageList).map(page=>{return page+" "})}</p>}

            <label className='mt-4'>{acceptMode ? "Course Name" : " Message"}:</label>

            {/* Inputs Start */}
            {/* If the user chooses to reject the submission a 'message' input will appear instead of the 'course name' input */}
            { acceptMode ?
                <input 
                  onChange={(e)=>SetInput(e.target.value)} 
                  type='text'
                  value={input}
                  className='mb-2 border-2 shadow-inner rounded-md text-lg p-2 focus:border-[#159aec] outline-none' 
                  />
            :
                <textarea 
                  type='text'
                  onChange={(e)=>SetInput(e.target.value)}  
                  className='h-2/5 mb-2 resize-none border-2 shadow-inner rounded-md text-lg p-2 focus:border-[#159aec] outline-none'
                /> 
            } 
            {/* Inputs End */}

            {/* Buttons start */}
            { acceptMode ? 
                  <button type='submit' onClick={onSubmitValidAssignmnet} className='w-[30%] text-center text-white font-medium h-fit p-2 bg-lime-600 hover:bg-lime-700 self-center rounded-md'>Accept Submission</button>
                :
                <div className='w-full flex justify-between items-center mt-4 px-8'>
                  <button type='submit' onClick={handleCompleteRejectiong} className='w-[30%] text-center text-white font-medium h-fit p-2 bg-red-600 hover:bg-red-700 self-center rounded-md'>Reject Completely</button>
                  <button type='submit' onClick={handlePendingFix} className='w-[30%] text-center text-white font-medium h-fit p-2 bg-yellow-500 hover:bg-yellow-600 0 self-center rounded-md'>Request Edit from User</button>
                </div>
            }
            {/* Buttons End */}
          </div>
        </div>
        {/* The PDF viewer start*/}
        <div className='w-[60%] border-2'>
          <Document
          className='h-[100vh] overflow-y-scroll'
            file={docArrayBuffer}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              {Array.from(new Array(numPages), (_, index) => ( // CLean this
                <Page /* In the future add a loading spinner */
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  onClick={(event)=>handlePageClick(index+1,event.target)}
                  className={( index+1 in pageList ? 'border-4 border-green-500 ' : "") +'w-fit mx-auto border-4 border-[#979797] my-2 cursor-pointer'}
                  />
              ))}
          </Document>
        </div>
     </div>
    }
  </>
  )
}

export default Review