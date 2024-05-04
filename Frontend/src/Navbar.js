// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Make sure the path is correct
import './Navbar.css';  // Make sure the path is correct

function Navbar() {
    const { currentUser, logout } = useAuth();  // Assuming logout is a method provided by useAuth
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = async () => {
        try {
            // Here, handle the logout process (e.g., clear localStorage)
            localStorage.removeItem('user');
            navigate('/signin');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    console.log('Current User in Navbar:', user);

    return (
        <nav className="navbar">
            <h2>Ta9afa</h2>
            {user ? (
                <div className="navbar-content">
                    <span>{user.username}</span>
                    <button className='logoutbtn' onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div className="nav-buttons">
                    <button className='signinbtn' onClick={() => navigate('/signin')}>Sign in</button>
                    <button className='signupbtn' onClick={() => navigate('/signup')}>Sign up</button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
