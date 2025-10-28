import React, { useState } from 'react';
import './SignUpPage.css';
import logo from '../assets/olalogo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationModal from './NotificationModal';

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const addUser = (e) => {
  e.preventDefault(); // Prevent form reload
  let newUser = { firstName, lastName, email, password };
  
  axios.post(`${API_URL}/user/register`, newUser)
    .then((res) => {
      console.log("Response:", res.data);
      showNotification("Signup successful! Please login.", "success");
      setTimeout(() => navigate("/signin"), 2000);
    })
    .catch((err) => {
      console.error("Error:", err.response ? err.response.data : err);
      showNotification("Signup failed, try again.", "error");
    });
};



  return (
    <>
      <div className="signup-container">
        <div className="signup-card animate__animated animate__fadeInDown">
          <img
            src={logo}
            alt="Ola Company Logo"
            className="signup-logo-img"
            width={234}
            height={57}
          />
          <form className='signup-form' onSubmit={addUser}>
            <input type="text" className="signup-input" placeholder='Enter your first name' onChange={(e) => setFirstName(e.target.value)}/>
            <input type="text" className="signup-input" placeholder='Enter your last name' onChange={(e) => setLastName(e.target.value)}/>
            <input type="email" className="signup-input" placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" className="signup-input" placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit" className="signup-btn">Signup</button>
          </form>
          <div style={{ width: '100%', textAlign: 'center', marginTop: '18px' }}>
            <div style={{ color: '#888', fontWeight: 500, marginBottom: '8px' }}>or</div>
            <a href="/signin" className="signup-link" style={{color:"#39d353"}}>Signin</a>
          </div>
        </div>
      </div>
      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </>
  );
};


export default SignUpPage;