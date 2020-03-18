import React, { Fragment } from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
    let userSignInText = '';
    if (isSignedIn) {
        userSignInText = <p onClick={() => onRouteChange('signOut')} className="f3 link dim black underline pa3 pointer">Sign out</p>
    }
    else {
        userSignInText =
            <Fragment>
                <p onClick={() => onRouteChange('signIn')} className="f3 link dim black underline pa3 pointer">Sign in</p>
                <p onClick={() => onRouteChange('register')} className="f3 link dim black underline pa3 pointer">Register</p>
            </Fragment>
    }

    return (
        <nav style={{ display: 'flex', justifyContent: 'flex-end' }} >
            {userSignInText}
        </nav>
    );
}

export default Navigation;