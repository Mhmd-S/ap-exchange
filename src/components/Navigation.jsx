import React, { useEffect, useState } from 'react'
import { useAuth } from '../firebase/auth'
import { Link } from 'react-router-dom';
import { getUserPoints } from '../firebase/firestore';

const Navigation = () => {
    const { authUser, signOut, userAdmin } = useAuth();
    const [userPoints, setUserPoints ] = useState(0);

    useEffect(()=>{
        getUserPoints(authUser.uid)
            .then((points)=>{
                setUserPoints(points);
            });
    })

    return (
    <header className='w-full h-1/6 flex justify-between items-center bg-[#0e0e1a] text-white font-bold'>
        <h3><Link to='/dashboard'><img className='w-[5rem] ml-6 aspect-square' src='/logo.svg' alt='Logo'/></Link></h3>
        <ul className='w-3/5  flex justify-evenly items-center text-lg'>
            <li className='border-b-2 border-transparent'>Points: {userPoints}</li>          
            <li className='border-b-2 border-transparent cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[#ffffffd7]'><Link to='/exchange'>Exchange</Link></li>          
            {userAdmin  &&  <li className='border-b-2 border-transparent cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[#ffffffd7]'><Link to='/admin'>Admin</Link></li>}
            <li className='border-b-2 border-transparent cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[#ffffffd7]'><Link to='/submit'>Submit</Link></li>
            <li className='border-b-2 border-transparent cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[#ffffffd7]'><Link to='/submissions'>Submissions</Link></li>
            <li className='border-b-2 border-transparent cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[#ffffffd7]'><Link to='/help'>Help</Link></li>
            <li>
                <button onClick={signOut}>
                    <img className='w-[2.5rem] aspect-square' src='/logout.svg' alt='logout'/>
                </button>
            </li>
        </ul>
    </header>
  )
}

export default Navigation