// create a landing page component in react
// Path: src/LandingPage.tsx


import {useSelector} from "react-redux";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

function TeacherHomePage() {
    const navigate = useNavigate();
    const loginInfo = useSelector((state: any) => state.gauth);
    return (
        <div>
            <h1>Landing Page {loginInfo.name}</h1>
            <p> Landing done</p>
            <Button onClick={()=>{navigate('/mycourses')}}>My Courses</Button>
        </div>
    )
}

export default TeacherHomePage;