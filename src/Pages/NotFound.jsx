import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="error-code">404</div>
      <p className="error-description">OOPS!, page can't be found.</p>
      <Link to="/home" className="home-button">Home</Link>
    </div>
  );
};

export default NotFound;
