import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({ login, isAuthenticated,setEmail }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '' 
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        let stat= login(email, password);
            // console.log(stat)
            stat.then(function(result) {
                if(result === 'Welcome Back!'){
                    setEmail(email)
                    toast.success(result);
                }
                else{
                    toast.error(result);
                }
             })
    };


    const continueWithGoogle = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`)

            window.location.replace(res.data.authorization_url);
        } catch (err) {

        }
    };


    if (isAuthenticated) {
        return <Navigate to='/' />
    }


    return (
        <div className='container mt-5'>
            
            <h1>Sign In</h1>
            <p>Sign into your Account</p>
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
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Password'
                        name='password'
                        value={password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <button className='btn btn-dark' type='submit'>Login</button>
            </form>
            <button className='btn btn-danger mt-3' onClick={continueWithGoogle}>
                Continue With Google
            </button>
            <br />
            
            <p className='mt-3'>
                Don't have an account? <Link to='/signup'>Sign Up</Link>
            </p>
            <p className='mt-3'>
                Forgot your Password? <Link to='/reset-password'>Reset Password</Link>
            </p>
        </div>
    );
};


const mapStateToProps = state => ({
    // state = Object { auth: Object { access: null, refresh: null, isAuthenticated: false, user: null } }
    // defined in auth.js (reducers)
    isAuthenticated: state.auth.isAuthenticated
    
});

export default connect(mapStateToProps, { login })(Login);
// if we are using 'connect' then all the parameters will be send like 'props' 
// either do this: const Login = (props) => { props.login() };  OR destructure them : const Login = ({ login, isAuthenticated }) => { login()};

