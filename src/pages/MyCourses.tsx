// create a landing page component in react
// Path: src/LandingPage.tsx


import {useSelector} from "react-redux";
import CourseCard from "../components/CourseDetails/CourseCard";

function MyCourses() {
    const loginInfo = useSelector((state: any) => state.gauth);
    return (
        <div>
            <CourseCard className="2nd" courseName="Maths"/>
            <CourseCard className="3rd" courseName="EVS"/>
            <CourseCard className="4th" courseName="Hindi"/>
        </div>
    )
}

export default MyCourses;