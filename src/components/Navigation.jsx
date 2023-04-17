import React, { useEffect, useState } from 'react'
import { useAuth } from '../firebase/auth'
import { Link, useLocation } from 'react-router-dom';
import { getUserPoints } from '../firebase/firestore';

const Navigation = ({authUser, signOut, userAdmin}) => {
    const location = useLocation().pathname;

    const [userPoints, setUserPoints ] = useState(0);

    useEffect(()=>{
        getUserPoints(authUser.uid)
            .then((points)=>{
                setUserPoints(points);
            });
    },[])

    return (
    <header className='w-full h-1/6 grid bg-[#0f89d2] text-white'>
        <div className='w-full h-full grid grid-cols-2 items-center text-lg bg-white text-black'>
            <h2 className='text-4xl tracking-wider w-fit ml-6 font-bold'><Link to='/exchange'><span className='text-[#2a83ff]'>AP</span>EX</Link></h2>
            <ul className='w-1/3 flex justify-between text-sm justify-self-end mr-4'>
                <li className='border-b-2 border-transparent flex items-center'>Points: {userPoints}</li> 
                <li className='border-b-2 border-transparent flex items-center cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[black]'><Link to='/help'>Help</Link></li>
                <li>
                    <button onClick={signOut} className='rounded-full hover:bg-[#00000017] p-1'>
                        <img className='w-[1.75rem] aspect-square ' src='/logout.svg' alt='logout'/>
                    </button>
                </li>
            </ul>
        </div>
        <ul className='w-full h-full flex justify-evenly items-center text-md font-bold'>       
            <li className={'h-full flex items-center border-b-2 border-transparent cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[#ffffffd7]' + (location==='/exchange' && ' opacity-80 border-b-2 border-[#ffffffd7]' )}><Link to='/exchange'>Exchange</Link></li>          
            {userAdmin  &&  <li className={'border-b-2 h-full flex items-center  border-transparent cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[#ffffffd7]'+ (location==='/admin' && ' opacity-80 border-b-2 border-[#ffffffd7]' )}><Link to='/admin'>Admin</Link></li>}
            <li className={'h-full flex items-center  border-b-2 border-transparent cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[#ffffffd7]'+ (location==='/submit' && ' opacity-80 border-b-2 border-[#ffffffd7]' )}><Link to='/submit'>Submit</Link></li>
            <li className={'h-full flex items-center  border-b-2 border-transparent cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[#ffffffd7]'+ (location==='/submissions' && ' opacity-80 border-b-2 border-[#ffffffd7]' )}><Link to='/submissions'>Your Submissions</Link></li>
            <li className={'h-full flex items-center  border-b-2 border-transparent cursor-pointer transition-all hover:opacity-80 hover:border-b-2 hover:border-[#ffffffd7]'+ (location==='/dashboard' && ' opacity-80 border-b-2 border-[#ffffffd7]' )}><Link to='/dashboard'>Owned Assignments</Link></li>
        </ul>
    </header>
  )
}

export default Navigation