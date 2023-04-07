import React from 'react'
import { useEffect, useState } from 'react';

import Navigation from '../components/Navigation';
import { getSubmission, getUserSubmissionRef } from '../firebase/firestore';
import { useAuth } from '../firebase/auth';
import SubmissionItem from '../components/SubmissionItem';
import { useNavigate } from 'react-router-dom';
import SubmissionUserView from '../components/SubmissionUserView';

const Submissions = () => {
    const navigate = useNavigate();

    const { authUser, isLoading } = useAuth();
    const [eleList, setEleList ] = useState([]);

    // Default is false, If it contains object related to the submission data it will display it.
    const [submissionShow, setSubmissionShow] = useState(false);

    const handleOnClick = (submissionInfo) => {
      setSubmissionShow(<SubmissionUserView submissionInfo={submissionInfo} setSubmissionShow={setSubmissionShow}/>);
    }

    useEffect(() => {

        if (!authUser) {
            navigate('/');
            return;
        }
          
        getUserSubmissionRef(authUser.uid).then((userSubRef) => { // This monster, jesus
          Promise.all(
            userSubRef.map(async(ref) => {
              return getSubmission(ref).then((data) => {
                return { id: ref, ...data };
              });
            })
          ).then((finalList) => {
            if (finalList[0] == undefined) {
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
        
      }, [authUser]);

  return (
    <div className='w-full'>
        <Navigation/>
        {
        submissionShow ? 
          submissionShow 
        :
          (
            eleList[0] ? 
              <ul className='w-full f-full grid auto-rows-[35%] grid-cols-1 justify-center justify-items-center py-6'>
                {eleList} 
              </ul> 
            : 
              <div className='w-full h-full flex flex-col justify-center items-center'>
                <img className='w-1/4' src='/emptyLogo.svg' alt="Empty"/>
                <h1 className='font-bold text-4xl text-[#d6d6d6ff]'>No Results Found</h1>
              </div>
          )
        }
    </div>
  )
}

export default Submissions;