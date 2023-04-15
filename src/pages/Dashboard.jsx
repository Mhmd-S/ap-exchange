import React, { useState, useEffect} from 'react'
import { useAuth } from '../firebase/auth'
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Navigation from '../components/Navigation';
import { getSubmission, getUserOwnedDocs } from '../firebase/firestore';
import MiniPDFViewer from '../components/MiniPDFViewer';
import ExchangeDisplayAssignment from '../components/ExchangeDisplayAssignment';

const Dashboard = () => {
  const navigate = useNavigate();

  const { authUser, isLoading } = useAuth();

  const [ assignmentChosen, setAssignmentChosen ] = useState(null); // JSX elements / Componenet that display the assigments.
  const [ eleList , setEleList ] = useState([]);

  useEffect(()=>{
    if(!authUser){
      navigate('/');
      return;
    }

    getUserOwnedDocs(authUser.uid)
      .then((ownedDocs)=>{
        Promise.all(
          ownedDocs.map(async(ref) => {
            return getSubmission(ref).then((data) => {
              return { id: ref, ...data };
            });
          })
        ).then((finalList) => {
          if (finalList[0] === undefined) {
            return null;
          }
          const elements = finalList.reverse().map(assignmentInfo => {
            return(<li className='w-full h-full grid grid-rows-[90%_10%] grid-cols-1 border-2 rounded-md hover:border-sky-500' key={assignmentInfo.id}>
                    <MiniPDFViewer handleAssignmentClick={handleAssignmentClick} assignmentInfo={assignmentInfo}/>
                    <p className='w-full flex justify-center items-center font-semibold text-ellipsis cursor-pointer' onClick={()=>{handleAssignmentClick(assignmentInfo, assignmentInfo.id)}}>{assignmentInfo.title}</p>
                  </li>)
          
          });
          setEleList(elements);
        }).catch(e=>console.log(e));
      })
  }, [authUser])

  const handleAssignmentClick = (assignmentInfo, submissionID) => {
    setAssignmentChosen(<ExchangeDisplayAssignment userID={authUser.uid} setAssignmentChosen={setAssignmentChosen} assignmentInfo={assignmentInfo} submissionID={submissionID} displayButton={false}/>)
}

  return ( 
    <div className='w-full h-screen'>
    {isLoading ? <Spinner/>
    : <>
        <Navigation/>
        <div className='relative w-full h-5/6'>
          {assignmentChosen ? assignmentChosen :
            <>
              <h1 className='w-full h-1/5 text-4xl font-bold pt-10 pl-10 underline'>Dashboard</h1>
              <ul className='w-full h-4/5 grid grid-cols-4 auto-rows-min px-8 py-4 gap-8'>
                {eleList}
              </ul>
            </>
          }
        </div>
      </>
    }
    </div>
)
}

export default Dashboard