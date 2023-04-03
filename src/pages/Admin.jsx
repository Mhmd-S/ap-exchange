import React, {useEffect, useState} from 'react';
import { useAuth } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
import Review from '../components/Review';

import { listSubmissions, getSubmission } from '../firebase/firestore';
import Spinner from '../components/Spinner';
import Navigation from '../components/Navigation';

const Admin = () => {

    const navigate = useNavigate();

    const { authUser, isLoading, userAdmin} = useAuth();

    const [ listLoading, setListLoading ] = useState(true);

    const [ listJSX, setListJSX ] = useState([]);
    const [ viewingInfo, setViewingInfo ] = useState(null);


    const onViewSub = async(submissionID) => {
        const data = await getSubmission(submissionID);
        setViewingInfo(<Review submission={{...data, submissionID}} setViewingInfo={setViewingInfo} />)
    }

    useEffect(()=>{
        if(!authUser){
            navigate('/');
        } else {
            if (!userAdmin) {
                navigate('/dashboard');
            }
        }
         
    },[authUser, userAdmin])

      useEffect(()=>{
        if(!authUser || !userAdmin){
            navigate('/');
        }else {
            listSubmissions().then((submissions)=>{
                const listJSX = submissions.docs.map(submission => {
                    return <li key={submission.id} onClick={()=>onViewSub(submission.id)} className='cursor-pointer p-2 hover:bg-sky-500/[.06]'>{submission.id}</li>;
                });
                setListJSX(listJSX);
                setListLoading(false); 
            }
        )}
      });

    return (
        <div>
            { viewingInfo ? viewingInfo : listLoading ? <Spinner/> :
            <>
                <Navigation/>
                    <div className='w-full grid grid-cols-2 justify-evenly align-center gap-8'>
                        <div>
                            <h3>New Submissions</h3>
                            <ul className='h-full w-full flex flex-col border-4 shadow-md rounded-md p-4'> {/* list here the submissions*/}
                                {listJSX ? listJSX : <p>Feels Empty</p>} 
                            </ul>
                        </div>
                        <div>
                            <h3>New Fixes</h3>

                            <ul className='h-full flex mx-auto flex-col border-4 shadow-md rounded-md p-4'> {/* list here the submissions*/}
                                <li className='cursor-pointer p-2 hover:bg-sky-500/[.06]'>lorem</li>                    
                                <li className='cursor-pointer p-2 hover:bg-sky-500/[.06]'>lorem</li>                    
                                <li className='cursor-pointer p-2 hover:bg-sky-500/[.06]'>lorem</li>                    
                                <li className='cursor-pointer p-2 hover:bg-sky-500/[.06]'>lorem</li>                    
                                <li className='cursor-pointer p-2 hover:bg-sky-500/[.06]'>lorem</li>                    
                                <li className='cursor-pointer p-2 hover:bg-sky-500/[.06]'>lorem</li>                    
                                <li className='cursor-pointer p-2 hover:bg-sky-500/[.06]'>lorem</li>                    
                                <li className='cursor-pointer p-2 hover:bg-sky-500/[.06]'>lorem</li>                    
                            </ul>

                        </div>
                    </div>
            </> 
            }
        </div>
    );


};

export default Admin;