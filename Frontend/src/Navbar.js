// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Make sure the path is correct
import './Navbar.css';  // Make sure the path is correct
import '@fortawesome/fontawesome-free/css/all.min.css'; // Adjust path as needed

function Navbar({ }) {
    const { currentUser, logout } = useAuth();  
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = async () => {
        try {
            // Here, handle the logout process (e.g., clear localStorage)
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    const handleUsernameClick = () => {
        navigate('/userArticles'); // Redirect to user articles page
      };

    return (
        <nav className="navbar">
            <h2>Ta9afa</h2>
            {user ? (
                <div className="navbar-content">
                    {user && (
                        <span className='profile' onClick={handleUsernameClick}>
                            <i className="fa fa-user" aria-hidden="true"></i>{user.username}</span>
                    )}
                    <button className='postbtn' onClick={() => navigate('/post-article')}>Post Article +</button>
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
