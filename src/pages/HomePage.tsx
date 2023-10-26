// create a landing page component in react
// Path: src/LandingPage.tsx


import {useSelector} from "react-redux";

function HomePage() {
    const loginInfo = useSelector((state: any) => state.gauth);
    return (
        <div>
            <h1>Landing Page {loginInfo.name}</h1>
            <p> Landing done</p>
        </div>
    )
}

export default HomePage;