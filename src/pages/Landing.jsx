import { useState, useEffect } from 'react'

import SignUpForm from '../components/SignUpForm';
import LogInForm from '../components/LogInForm';
import ForgotPassword from '../components/ForgotPassword';
import Spinner from '../components/Spinner';

import { useAuth } from '../firebase/auth' 
import { useNavigate } from 'react-router-dom';



const Home = () => {
  const navigate = useNavigate();

  const {authUser, isLoading, userAdmin} = useAuth();
  const [signUpShow, setSignUpShow] = useState(false); 
  const [resetShow, setResetShow] = useState(false); 

  useEffect(()=>{
    console.log(isLoading)
    if (authUser && !isLoading) {
      if(userAdmin) {
        navigate('/admin');
      } else {
      navigate("/dashboard");
      }
    }
  }, [authUser, isLoading, userAdmin])

  return (
    <div className='w-full flex flex-col items-center justify-evenly bg-[#f0f2f5] relative'>
      {isLoading ? <Spinner/>:
      <div className='w-full'>
        <div className='w-full h-screen flex flex-row text-center'>
            <div className='w-[55%] px-8 h-screen flex flex-col justify-center items-center'>
              <h1 className='text-6xl font-climate'>Welcome To <span className='text-9xl'><span className='text-[#2a83ff]'>AP</span>EX</span></h1>
              <h4 className='text-4xl mt-10 font-robo'>Assigment Exchange Platform</h4>
            </div>
            <LogInForm signUpShow={signUpShow} setSignUpShow={setSignUpShow} setResetShow={setResetShow} />
            {signUpShow && <SignUpForm setSignUpShow={setSignUpShow} />}
            {resetShow && <ForgotPassword setResetShow={setResetShow} />}
        </div>
        <div>
          <p>InfoInfo</p>
        </div>
      </div>
      }
    </div>
  )
}

export default Home;