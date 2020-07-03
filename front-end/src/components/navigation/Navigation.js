import React, { Fragment } from 'react';
import ProfileIcon from '../profile-icon/ProfileIcon';

const Navigation = ({ onRouteChange, isSignedIn, toggleModal }) => {
    let userSignInText = '';
    if (isSignedIn) {
        userSignInText =
            <Fragment>
                <ProfileIcon onRouteChange={onRouteChange} toggleModal={toggleModal} />
            </Fragment>
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