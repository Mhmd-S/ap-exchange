import React, { useState, useEffect} from 'react'
import { useAuth } from '../firebase/auth'
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const navigate = useNavigate();

  const { authUser, isLoading } = useAuth();

  useEffect(()=>{
    if(!authUser && !isLoading){
      console.log(authUser)
      navigate('/');
    }
  }, [authUser, isLoading])

  return ( 
    <div className='w-full h-screen'>
    {isLoading ? <Spinner/>
    : <>
        <Navigation/>
        <div className='w-full h-5/6'>Dashboard</div>
      </>
    }
    </div>
)
}

export default Dashboard