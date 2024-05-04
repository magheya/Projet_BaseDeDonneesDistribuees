import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/signup', { username, email, password }, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('User registered in:', response.data);
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log('Logged user:', response.data.user);
                navigate('/HomePage');
            }
        } catch (error) {
            console.error('Error registering:', error.response.data);
        }
    };
    

    return (
        <div className="auth-form">
            <form onSubmit={handleSignUp}>
                <h2>Sign Up</h2>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
