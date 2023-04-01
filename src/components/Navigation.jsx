import React from 'react'
import { useAuth } from '../firebase/auth'
import { Link } from 'react-router-dom';

const Navigation = () => {
    const { authUser, signOut, userAdmin } = useAuth();

    return (
    <header className='w-full h-1/6 flex justify-between items-center border-4'>
        <h3><Link to='/dashboard'><img className='w-[5rem] ml-6 aspect-square' src='/logo.svg' alt='Logo'/></Link></h3>
        <ul className='w-2/5  flex justify-evenly items-center text-lg'>
            {userAdmin  &&  <li className='border-b-2 border-transparent cursor-pointer hover:border-blue-500'><Link to='/admin'>Admin</Link></li>}
            <li className='border-b-2 border-transparent cursor-pointer hover:border-blue-500'><Link to='/submit'>Submit</Link></li>
            <li className='border-b-2 border-transparent cursor-pointer hover:border-blue-500'>Help</li>
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