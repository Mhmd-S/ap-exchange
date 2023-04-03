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
    <div>
    {isLoading ? <Spinner/>
    : <>
        <Navigation/>
        <div>Dashboard</div>
      </>
    }
    </div>
)
}

export default Dashboard