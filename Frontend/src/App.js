import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import HomePage from './HomePage';
import Navbar from './Navbar';
import PostArticle from './PostArticle';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/WelcomePage" element={<WelcomePage />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/post-article" element={<PostArticle />} />
      </Routes>
    </Router>
  );
}

export default App;  
