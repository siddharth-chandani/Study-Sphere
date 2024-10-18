import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { googleAuthenticate } from '../actions/auth';
import queryString from 'query-string';
import { toast } from 'react-toastify';

const Google = ({ googleAuthenticate }) => {
    let location = useLocation();

    const [islogin, setIslogin] = useState(false)

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        // console.log('State: ' + state);
        // console.log('Code: ' + code);

        if (state && code) {

            let stat = googleAuthenticate(state, code);
            stat.then(function(result) {
                if(result === 'Logged IN'){
                    toast.success(result);
                    setIslogin(true)
                }
                else{
                    toast.error(result);
                }
             })
        }

        
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    if(islogin){
        return <Navigate to="/" />;
    }

    return (
        <div className='container'>
            <div class='jumbotron mt-5'>
                <h1 class='display-4'>Welcome to Study Sphere!</h1>
                <p class='lead'>This is an incredible online learning platform with production level features!</p>
                <hr class='my-4' />
                <p>Click the Log In button</p>
                <Link class='btn btn-dark btn-lg' to='/login' role='button'>Login</Link>
            </div>
        </div>
    );
};

export default connect(null, { googleAuthenticate })(Google);
