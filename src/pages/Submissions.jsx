import React from 'react'
import { useEffect, useState } from 'react';

import Navigation from '../components/Navigation';
import { getSubmission, getUserSubmissionRef } from '../firebase/firestore';
import { useAuth } from '../firebase/auth';
import SubmissionItem from '../components/SubmissionItem';
import { useNavigate } from 'react-router-dom';

const Submissions = () => {
    const navigate = useNavigate();
    const { authUser, isLoading } = useAuth();
    const [eleList, setEleList ] = useState([]);

    useEffect(() => {

        if (!authUser) {
            navigate('/');
            return;
        }
          
        getUserSubmissionRef(authUser.uid).then((userSubRef) => { // This monster, jesus
          Promise.all(
            userSubRef.map(async(ref) => {
              return getSubmission(ref).then((data) => {
                return { id: ref, data: data };
              });
            })
          ).then((finalList) => {
            console.log(finalList)
            if (finalList[0] == undefined) {
              return null;
            }
            const elements = finalList.map((item) => {
              return <SubmissionItem key={item.id} data={item.data} />;
            });
            setEleList(elements);
          });
        });
        
      }, [authUser]);

  return (
    <div className='w-full'>
        <Navigation/>
        <ul className='w-full flex flex-col justify-center items-center py-6'>
          {eleList[0] ? eleList : <div className='w-full h-full flex flex-col justify-center items-center'><img className='w-1/4' src='/emptyLogo.svg' alt="Empty"/><h1 className='font-bold text-4xl text-[#d6d6d6ff]'>No Results Found</h1></div>}
        </ul>
    </div>
  )
}

export default Submissions;