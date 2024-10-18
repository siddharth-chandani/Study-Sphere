import React, { useEffect } from 'react';
import MyNavbar from '../components/MyNavbar';
import { connect } from 'react-redux';
import { checkAuthenticated, load_user } from '../actions/auth';

const Layout = ({ checkAuthenticated, load_user, children,email }) => {
    useEffect(() => {
        checkAuthenticated();
        load_user();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <MyNavbar email={email}/>
            {children}
        </div>
    );
};

export default connect(null, { checkAuthenticated, load_user })(Layout);
