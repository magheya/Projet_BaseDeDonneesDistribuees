import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password }, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('User signed in:', response.data);
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log('Logged user:', response.data.user);
                navigate('/HomePage');
            }
        } catch (error) {
            console.error('Error signing in:', error.response.data);
        }
    };
    

    return (
        <div className="auth-form">
            <form onSubmit={handleSignIn}>
                <h2>Sign In</h2>
                <input type="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Sign In</button>
                <h5 className='redirectSignUp'>Don't have an account ? <a href="/signup">Sign Up</a></h5>
            </form>
        </div>
    );
}

export default SignIn;
