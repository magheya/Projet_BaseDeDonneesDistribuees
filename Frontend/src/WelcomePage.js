import React from 'react';
import './WelcomePage.css';  
import { useAuth } from './AuthContext';


function WelcomePage() {

  const { currentUser } = useAuth();

  return (
    <div className="App">
      <div className="content">
        <div className="story">
          <h1 className='title'>Everyone has a story to tell</h1>
          <p className='paragraph'>This website is a platform for posting useful articles and sharing knowledge. Whether you're a reader seeking wisdom or a writer looking to engage with a receptive audience, this space is for you.</p>
        </div>
        <div className="actions">
          <button className='btnnav'>Start Reading →</button>
          <button className='btnnav'>Start Writing →</button>
          <button className='btnnav'>Become a Member →</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
