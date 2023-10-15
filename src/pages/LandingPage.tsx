import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
//import GoogleLoginComponent from "./components/GoogleLogin/GoogleLoginComponent";
import GoogleLoginComponent from "../components/GoogleLogin/GoogleLoginComponent";



function LandingPage()  {
    const navigate = useNavigate();
    const successfulSignIn = (token: string) => {
        console.log('Signin successful: ' + token);
        //redirect to landing page now.
        navigate('/dashboard');
    }
    var backgroundImage = 'background-desktop.jpg';
    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white', // You can change the text color to make it visible against the background
    };
    return (
        <>
            <div style={backgroundStyle}>
                <div style={{display: "inline-block", margin: "auto", border: "solid", padding: 20, marginTop: "auto%"}}>
                    <h1>Parishkaaram Public School</h1>
                    <p>For better education</p>
                    <GoogleLoginComponent callback={successfulSignIn}/>
                    {/* Add more content as needed */}
                </div>
            </div>
       </>
    )
}

export default LandingPage;