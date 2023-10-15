import React, {useEffect, useRef, useState} from "react";
import jwt_decode from "jwt-decode";
//https://rangen.medium.com/dynamically-load-google-scripts-with-react-and-the-useeffect-hook-3700b908e50f
function GoogleLoginComponent (props) {
    const [isGISLoaded, setGISLoaded] = useState(false);
    const ref = useRef(null);

    const signinstart = (credential) => {
        const responsePayload: any = jwt_decode(credential);

        console.log("ID: " + responsePayload.sub);
        console.log('Full Name: ' + responsePayload.name);
        console.log('Given Name: ' + responsePayload.given_name);
        console.log('Family Name: ' + responsePayload.family_name);
        console.log("Image URL: " + responsePayload.picture);
        console.log("Email: " + responsePayload.email);
        // Request an access token.
        // @ts-ignore
        window.googletokens.tokenClient.callback = async (response:any) => {
            if (response.error !== undefined) {
                throw (response);
            }
            // @ts-ignore
            window.googletokens.accessToken = response.access_token;
            props.callback(response.access_token);
        };
        // @ts-ignore
        if (window.googletokens.accessToken === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            // @ts-ignore
            window.googletokens.tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            // @ts-ignore
            window.googletokens.tokenClient.requestAccessToken({prompt: ''});
        }
    }
    const gisLoaded = () => {
        // TODO(developer): Replace with your client ID and required scopes.
        console.log('gis loaded');
        // @ts-ignore
        window.googletokens.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '5153499728-7qcksjj51o5cs75l6mjeiavqas9fu2p7.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive',
            callback: '', // defined later
        });
        // @ts-ignore
        window.googletokens.gisInited = true;
        setGISLoaded(true);
    }
    useEffect(() => {
        console.log('Adding script tag')
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://accounts.google.com/gsi/client';
        scriptTag.onload = gisLoaded;
        document.body.appendChild(scriptTag);
    }, []);
    useEffect(() => {
        const element: any = ref.current;
        // @ts-ignore
        if (window.googletokens.gisInited) {
            console.log(element.id);
            console.log('ccc');
            // @ts-ignore
            renderButton(element, signinstart);
        } else {
            console.log('gisNotInitiated yet');
        }
    }, [isGISLoaded]);
    return (
        <>
            <div id="GLogin_Parent" style={{display: "inline-block"}} ref={ref}/>
        </>
    )
}

export default GoogleLoginComponent;