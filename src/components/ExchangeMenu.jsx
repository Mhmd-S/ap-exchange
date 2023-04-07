import React, { useEffect, useState } from 'react'
import { getCourses } from '../firebase/firestore';
import Spinner from './Spinner'

const ExchangeMenu = ({ setCourseChosen }) => {
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

    const handleSearchChange = (e) => {
        const inputValue = e.target.value;
        setSearchInput(inputValue);
    };

    const filteredCoursesList = coursesList.filter((course) =>
        course.id.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div>
                    <div>
                        <input value={searchInput} onChange={handleSearchChange} />
                    </div>
                    {filteredCoursesList.length > 0 ? (
                        <ul>
                            {filteredCoursesList.map((course) => (
                                <li onClick={()=>setCourseChosen(course.id)} key={course.id}>{course.id}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            )}
        </>
    );
};

export default ExchangeMenu;
