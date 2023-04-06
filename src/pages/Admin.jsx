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

    const getListOfSubmissionsJSX = async() => {
        const listElements = listSubmissions(5).then((submissions)=>{
            return submissions.docs.map(submission=> {
                const submissionID = submission.id;
                const data = submission.data();
                return <Review key={submission.id} submission={{...data, submissionID}} nextSubmissionJSX={nextSubmissionJSX}/>
            })
        }).catch(e=> console.log(e));
        setListLoading(false);
        return listElements;
    }

    const refreshList = () => {
        getListOfSubmissionsJSX()
                .then(listElements => setListJSX(listElements))
                .then(setListLoading(false));
    }

    const nextSubmissionJSX = () => {
        const copyList = listJSX.slice(1,);
        if( copyList[0]===undefined){
            refreshList();
        }else {        
            setListJSX(copyList);
       }
    }
    // const onViewSub = async(submissionID) => {
    //     const data = await getSubmission(submissionID);
    //     setViewingInfo(<Review submission={{...data, submissionID}} setViewingInfo={setViewingInfo} />)
    // }

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
            refreshList();
        }
      },[]);

    return (
        <div> 
            {listLoading ? <Spinner/> :
            <>
                <Navigation/>
                    <div className='w-full h-max-screen flex justify-evenly align-center'>
                        {listJSX[0] == undefined ? <div className='w-full h-full flex flex-col justify-center items-center'><img className='w-1/4' src='/emptyAdmin.svg' alt="Empty"/><h1 className='font-bold text-4xl text-[#d6d6d6ff]'>No Results Found</h1></div> : listJSX[0]}
                    </div>
            </> 
            }
        </div>
    );


};

export default Admin;