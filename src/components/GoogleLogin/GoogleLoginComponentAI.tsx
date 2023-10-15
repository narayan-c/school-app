import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';

const GoogleLoginComponent = () => {
    const [isGAPILoaded, setGAPILoaded] = useState(false);

    const gapiLoaded = () => {
        // TODO(developer): Replace with your client ID and required scopes.
        console.log('gapi loaded');
        // @ts-ignore Now load auth2 module
        gapi.load('auth2', () => {
            // @ts-ignore
            window.googletokens.gapiInited = true;
            setGAPILoaded(true);
        });

    }
    const handleGoogleLogin = () => {
        if (isGAPILoaded) {
            // @ts-ignore once auth2 is loaded call init on it.
            gapi.auth2.init({
                client_id: '5153499728-7qcksjj51o5cs75l6mjeiavqas9fu2p7.apps.googleusercontent.com',
            }).then(() => {
                // @ts-ignore
                const auth2 = gapi.auth2.getAuthInstance();
                auth2.signIn().then((googleUser) => {
                    const profile = googleUser.getBasicProfile();
                    const userID = profile.getId();
                    const userName = profile.getName();
                    const userEmail = profile.getEmail();
                    const userImage = profile.getImageUrl();

                    // Handle user data as needed
                    console.log(userID, userName, userEmail, userImage);
                });
            });
        }
    };
    useEffect(() => {
        console.log('Adding script tag')
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://apis.google.com/js/api.js';
        scriptTag.onload = gapiLoaded;
        document.body.appendChild(scriptTag);
    }, []);

    return (
        <div className="text-center">
            <Button variant="danger" size="lg" onClick={handleGoogleLogin}>
                Log in with Google
            </Button>
        </div>
    );
};

export default GoogleLoginComponent;