import React from 'react'
import { useEffect, useState } from 'react';

import Navigation from '../components/Navigation';
import { getSubmission, getUserSubmissionRef } from '../firebase/firestore';
import { useAuth } from '../firebase/auth';
import SubmissionItem from '../components/SubmissionItem';
import { useNavigate } from 'react-router-dom';
import SubmissionUserView from '../components/SubmissionUserView';
import Spinner from '../components/Spinner';

const Submissions = () => {
    const navigate = useNavigate();

    const { authUser, isLoading, userAdmin, signOut } = useAuth();
    const [eleList, setEleList ] = useState([]);

    // Default is false, If it contains object related to the submission data it will display it.
    const [submissionShow, setSubmissionShow] = useState(null);

    const handleOnClick = (submissionInfo) => {
      setSubmissionShow(<SubmissionUserView submissionInfo={submissionInfo} setSubmissionShow={setSubmissionShow} userSubmissionsJSX={userSubmissionsJSX}/>);
    }

    const userSubmissionsJSX =()=> {
      getUserSubmissionRef(authUser.uid).then((userSubRef) => { // This monster, jesus
        if(userSubRef === undefined){
          return;
        }
        Promise.all(
          userSubRef.map(async(ref) => {
            return getSubmission(ref).then((data) => {
              return { id: ref, ...data };
            });
          })
        ).then((finalList) => {
          if (finalList[0] === undefined) {
            return null;
          }
          const elements = finalList.reverse().map(item => {
            if (item.status === 'fix' || item.status === 'rejected'){
              return <SubmissionItem handleOnClick={handleOnClick}  key={item.id} submissionInfo={item} />;
            } else {
              return <SubmissionItem key={item.id} submissionInfo={item} />;
            }
          });
          setEleList(elements);
        });
      });
    }

    useEffect(() => {

        if (!authUser) {
            navigate('/');
            return;
        }
          
        userSubmissionsJSX();
        
      }, [authUser]);

  return (
     <div className='w-full max-h-screen overflow-hidden'>
     {isLoading ? <Spinner/>
     : <div className={'w-full h-screen relative' + (submissionShow && ' scroll')}>
         <Navigation userAdmin={userAdmin} signOut={signOut} authUser={authUser}/>
         <h1 className='w-full h-1/6 text-4xl font-bold pt-10 pl-10 underline'>Your Submissions</h1>
         {submissionShow && submissionShow} 
          {
            eleList[0] ? 
              <ul className='w-full h-4/6 grid auto-rows-[45%] grid-cols-1 justify-center justify-items-center py-6 overflow-y-auto'>
                {eleList} 
              </ul> 
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

export default Submissions;