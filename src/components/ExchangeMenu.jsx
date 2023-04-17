import React, { useEffect, useState } from 'react'
import { getCourses } from '../firebase/firestore';
import Spinner from './Spinner'

const ExchangeMenu = ({ courseChosen ,setCourseChosen, setCurrentPage, setCourseItemsJSX }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [coursesList, setCoursesList] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        getCourses()
            .then((courses) => {
                const list = courses.docs.map((course) => {
                    return {
                        id: course.id
                    };
                });
                setCoursesList(list);
                setIsLoading(false);
            })
            .catch((e) => console.log(e));
    }, []);

    const handleOnClick = (courseID) => {
        if (courseChosen === courseID){
            return;
        }
        setCourseChosen(courseID);
        setCurrentPage(1);
        setCourseItemsJSX([]);
    }

    const handleSearchChange = (e) => {
        const inputValue = e.target.value;
        setSearchInput(inputValue);
    };

    const filteredCoursesList = coursesList.filter((course) =>
        course.id.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className='relative w-full h-full grid grid-rows-[15%_85%] justify-items-center overflow-hidden border-r-2'>
            {isLoading ? <Spinner/> : 
            <>
            <div className='w-full h-full border-b-2 flex justify-center items-center'>
                <input className='w-4/5 text-[#767a7e] h-min px-2 py-1 bg-[#f1f3f4] rounded-sm outline-none focus:bg-white focus:shadow-lg transition-all ' placeholder='Filter' value={searchInput} onChange={handleSearchChange} />
            </div>     
            {filteredCoursesList.length > 0 ? 
                <div className='w-4/5 flex flex-col py-4 items-center z-[1]'>
                    <h4 className='w-full text-[#666] text-xl text-center'>Course Name</h4>
                    <ul className='w-full h-full overflow-y-scroll'>
                        {filteredCoursesList.map((course) => (
                            <li className={'z-10 w-full pl-4 py-2 cursor-pointer border-l-[1px] border-[#adadad86] hover:border-sky-600 hover:text-sky-500 hover:bg-[#7dd8fc41]' + (courseChosen === course.id && ' border-sky-600 text-sky-500 bg-[#7dd8fc41]' ) } onClick={()=>handleOnClick(course.id)} key={course.id}>{course.id}</li>
                        ))}
                    </ul>
                </div>
             : 
                <p>No results found.</p>
            }
            </>
        }
        </div>
    );
};

export default ExchangeMenu;
