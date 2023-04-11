import React, {useEffect, useState} from 'react'
import { getCourseDocs } from '../firebase/firestore'

import ExchangeMenu from '../components/ExchangeMenu'
import Navigation from '../components/Navigation'
import ExchangeDisplayAssignment from '../components/ExchangeDisplayAssignment'
import MiniPDFViewer from '../components/MiniPDFViewer'
import Spinner from '../components/Spinner'

const Exchange = () => {

    const [ courseChosen, setCourseChosen ] = useState(null); // Course choosen by user
    const [ courseItemsJSX, setCourseItemsJSX ] = useState([]);  // JSX elements of the assigments
    const [ lastRequestedList, setLastRequestedList ] = useState(null); // Last requested batch from firebase. Will be used for the startAfter method to get a new batch instead of the previous ones.
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ endOfSubmissions , setEndOfSubmissions ] = useState(false); // This variable will indicate if we reached the end of a courses submission
    const [ assignmentChosen, setAssignmentChosen ] = useState(null); // JSX elements / Componenet that display the assigments.

    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(()=>{
        if(!courseChosen){
            setIsLoading(false);
            return;
        }

        (async () => { // iife so we could use the await in the useEffect();
            await getAsignments();
          })();

    },[courseChosen])

    const getAsignments = async(lastRequested) => {
        setIsLoading(true);
        getCourseDocs(courseChosen, lastRequested) // Requests a new batch of assigments from firestore.
            .then((submissions)=>{
                
                if (submissions.empty) { // Blocks future submissions from happening because the last response from firestore was empty
                    setEndOfSubmissions(true);
                    return;
                }

                setLastRequestedList(submissions);

                const list = submissions.docs.map(submission => { // This soup parses through the response brought from firestore and creates a list of JSX elements with the information. 
                    const assignmentInfo = submission.data();
                    return <li className='w-full h-full grid grid-rows-[85%_15%] grid-cols-1 border-2 rounded-md hover:border-sky-500' key={submission.id}>
                                <MiniPDFViewer handleAssignmentClick={handleAssignmentClick} assignmentInfo={assignmentInfo}/>
                                <p className='w-full flex justify-center items-center font-semibold text-ellipsis cursor-pointer' onClick={()=>handleAssignmentClick(assignmentInfo)}>{assignmentInfo.title}</p>
                            </li>
                })

                setCourseItemsJSX([...courseItemsJSX, ...list]);
            })
            .catch(e=> console.log(e))
            .finally(()=>setIsLoading(false))
    }   

    // Handles the next page
    const handleNext = async() => {
        if (currentPage === Math.ceil(courseItemsJSX.length / 3)){
            if (endOfSubmissions) {
                return;
            }
            await getAsignments(lastRequestedList);
        }
        setCurrentPage(currentPage+1);
    }
 // Handle the previous page
    const handlePrevious = () => {
        if (currentPage === 1) {
            return;
        } else {
            setCurrentPage(currentPage-1);
        }
    }

    const handleAssignmentClick = (assignmentInfo) => {
        setAssignmentChosen(<ExchangeDisplayAssignment setAssignmentChosen={setAssignmentChosen} assignmentInfo={assignmentInfo}/>)
    }

  return (
    // Fetch the courses and display them, set a realtime search.
    <div className='w-full h-screen'>
    { isLoading ? <Spinner /> : 
    <>
        <Navigation/>
        <div className='relative w-full h-5/6 grid grid-cols-[20%_80%] grid-rows-1'>
            <ExchangeMenu courseChosen={courseChosen} setCourseChosen={setCourseChosen} /> 
            <div className='w-full h-full relative'>
                {assignmentChosen && assignmentChosen } 
                {courseChosen && <h4 className='w-full p-6 text-4xl flex justify-between items-center'>
                    {courseChosen}
                    <div className=' w-1/6 flex pr-10 justify-between'>
                        <img src='./left.svg' alt='Back' onClick={handlePrevious} dis className='w-[2.5rem] cursor-pointer'/>
                        <img src='./right.svg' alt='Right' onClick={handleNext} className='w-[2.5rem] cursor-pointer'/>
                    </div>
                    </h4>}
                <ul className='w-full h-4/6 grid grid-cols-3 grid-rows-1 px-8 py-4 gap-8'> 
                    {courseItemsJSX[currentPage*3 - 3] ? courseItemsJSX[currentPage*3 - 3] : endOfSubmissions && <div>No More Results</div>} {/* Using the page number as an index to get 3 JSX elements from the list and display them*/}
                    {courseItemsJSX[currentPage*3 - 2] ? courseItemsJSX[currentPage*3 - 2] : undefined}
                    {courseItemsJSX[currentPage*3 -1 ] ? courseItemsJSX[currentPage*3 - 1] : undefined}
                </ul>
            </div>
        </div>
        </> }
    </div>
  )
}

export default Exchange