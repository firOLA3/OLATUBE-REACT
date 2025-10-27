import React from 'react';
import { Link } from 'react-router-dom';
import './InDevelopment.css';

const InDevelopment = () => {
  return (
    <div className="indevelopment-container">
      <div className="development-code">🚧</div>
      <h1 className="development-title">Under Development</h1>
      <p className="development-description">This feature is currently being built. Check back soon!</p>
      <Link to="/home" className="home-button">Back to Home</Link>
    </div>
  );
};

export default InDevelopment;
