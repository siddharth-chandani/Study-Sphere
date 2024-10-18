import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { verify } from '../actions/auth';
import { toast } from 'react-toastify';

const Activate = ({ verify}) => {
    const [verified, setVerified] = useState(false);
    
    const { uid,token } = useParams();
    const verify_account = e => {
        // const uid = match.params.uid;
        // const token = match.params.token;
        console.log(uid,token)

        let stat = verify(uid, token);
        stat.then(function(result) {
            if(result === 'Account Acivated!'){
                toast.success(result);
                setVerified(true);
            }
            else{
                toast.error(result);
            }
         })
    };

    if (verified) {
        return <Navigate to='/' />
    }

    return (
        <div className='container'>
            <div 
                className='d-flex flex-column justify-content-center align-items-center'
                style={{ marginTop: '200px' }}
            >
                <h1>Verify your Account:</h1>
                <button
                    onClick={verify_account}
                    style={{ marginTop: '50px' }}
                    type='button'
                    className='btn btn-dark'
                >
                    Verify
                </button>
            </div>
        </div>
    );
};

export default connect(null, { verify })(Activate);
