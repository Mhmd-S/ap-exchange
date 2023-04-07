import React, {useEffect, useState} from 'react'
import ExchangeMenu from '../components/ExchangeMenu'
import Navigation from '../components/Navigation'

import { getCourseDocs } from '../firebase/firestore'
import ExchangeDisplayAssignment from '../components/ExchangeDisplayAssignment'

const Exchange = () => {

    const [ courseChosen, setCourseChosen ] = useState(null);
    const [ courseItemsJSX, setCourseItemsJSX ] = useState(null);  
    
    const [ assignmentChosen, setAssignmentChosen ] = useState(null);

    const [ isLoading, setIsLoading ] = useState(true);


    useEffect(()=>{
        if(!courseChosen){
            setIsLoading(false);
            return;
        }

        getCourseDocs(courseChosen)
            .then((submissions)=>{
                const list = submissions.docs.map(submission => {
                    const assignmentInfo = submission.data();
                    return <div onClick={()=>handleAssignmentClick(assignmentInfo)} key={submission.id}>{assignmentInfo.title}</div>
                })
                setCourseItemsJSX(list);
            })

    },[courseChosen])


    const handleAssignmentClick = (assignmentInfo) => {
        setAssignmentChosen(<ExchangeDisplayAssignment assignmentInfo={assignmentInfo}/>)
    }

  return (
    // Fetch the courses and display them, set a realtime search.
    <div>
        <Navigation/>
        <div>
            <ExchangeMenu setCourseChosen={setCourseChosen} /> 
            <div>
                {assignmentChosen ? assignmentChosen : courseItemsJSX}
            </div>
        </div>
    </div>
  )
}

export default Exchange