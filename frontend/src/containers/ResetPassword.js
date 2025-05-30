import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset_password } from '../actions/auth';
import { toast } from 'react-toastify';

const ResetPassword = ({ reset_password }) => {
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        email: ''
    });

    const { email } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        let stat = reset_password(email);
        stat.then(function(result) {
            if(result === 'Email Sent!'){
                toast.success(result);
                setRequestSent(true);
            }
            else{
                toast.error(result);
            }
         })
    };

    if (requestSent) {
        return <Navigate to='/' />
    }

    return (
        <div className='container mt-5'>
            <h1>Request Password Reset:</h1>
            <form onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <button className='btn btn-dark' type='submit'>Reset Password</button>
            </form>
        </div>
    );
};

export default connect(null, { reset_password })(ResetPassword);
