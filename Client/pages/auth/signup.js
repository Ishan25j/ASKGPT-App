import { useState } from 'react';
import useRequest from '../../hooks/use-request';

import Router from 'next/router';


const SignUp = () => {

    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    // * A hook for sending request and recieving response or errors
    const { doRequest, errors } = useRequest({
      url: '/api/users/signup',
      method: 'post',
      body: {
        username, email, password
      },
      // * On success, navigate user to root page
      onSuccess: () => Router.push('/')
    }) 

    const onSubmit = async event => {
        event.preventDefault();

        // * Calling a hook function for sending request
        doRequest();
    };

    return (
        <div className="container">
            <br/>
            <h1 style={{color: 'white'}}>Sign Up</h1>
            <hr/>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                    type="text" 
                    className="form-control" 
                    aria-describedby="UsernameHelp"
                    value={email}
                    onChange={e => setUserName(e.target.value)}
                    autoFocus
                    />
                    <div id="UsernameHelp" className="form-text" style={{color: 'white'}}><i>Write valid username.</i></div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input
                    type="email" 
                    className="form-control" 
                    aria-describedby="emailHelp"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                    />
                    <div id="emailHelp" className="form-text" style={{color: 'white'}}><i>Write valid email.</i></div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />
                </div>
                    { errors && <div className="alert alert-danger" role="alert">{errors}</div>}
                    <br/>
                    <br/>
                <button type="submit" className="btn btn-primary">Submit</button>    
            </form>
            <div className="space"></div>
        </div>
    );
}
 
export default SignUp;