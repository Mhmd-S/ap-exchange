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

  const { authUser, isLoading, signOut, userAdmin } = useAuth();

  const [ assignmentChosen, setAssignmentChosen ] = useState(null); // JSX elements / Componenet that display the assigments.
  const [ eleList , setEleList ] = useState(null);

  useEffect(()=>{
    if(!authUser){
      navigate('/');
      return;
    }

    getUserOwnedDocs(authUser.uid)
      .then((ownedDocs)=>{
        if(ownedDocs === undefined) {
          return;
        }
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
    setAssignmentChosen(<ExchangeDisplayAssignment userID={authUser.uid} setAssignmentChosen={setAssignmentChosen} assignmentInfo={assignmentInfo} submissionID={submissionID} displayButton={false} bucket={assignmentInfo.completeBucket}/>)
}

  return ( 
    <div className='w-full overflow-hidden'>
    {isLoading ? <Spinner/>
    : <div className='w-full h-screen max-h-screen relative'>
        {assignmentChosen && assignmentChosen}
        <Navigation userAdmin={userAdmin} signOut={signOut} authUser={authUser}/>
        <h1 className='w-full h-1/6 text-4xl font-bold pt-10 pl-10 underline'>Owned Assignments</h1>
        {eleList ? 
          <div className='relative w-full h-4/6'>
            <ul className='w-full h-4/5 grid grid-cols-4 auto-rows-min px-8 py-4 gap-8 overflow-y-auto'>
              {eleList} 
            </ul> 
          </div>
            : 
          <div className='w-full h-4/6 flex flex-col justify-center items-center cursor-default'>
            <img className='w-1/4' src='/emptyLogo.svg' alt="Empty"/>
            <h1 className='font-bold text-4xl text-[#d6d6d6ff]'>No Results Found</h1>
          </div>
            }              
      </div>
    }
    </div>
)
}

export default Dashboard