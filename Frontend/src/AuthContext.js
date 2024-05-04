// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('currentUser'); // Retrieve user from local storage
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            if (response.data.message === 'Logged in successfully') {
                setCurrentUser({ username }); 
                localStorage.setItem('currentUser', JSON.stringify({ username }));  // Persist user in local storage
                return response.data;
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');  // Clear user from local storage
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
