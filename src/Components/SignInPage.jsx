import React, { useState } from 'react';
import logo from '../assets/olalogo.png';
import './SignInPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationModal from './NotificationModal';

const SignInPage = () => {
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

  const loginUser = (e) => {
  e.preventDefault(); // Prevent form reload
  const oldUser = { email, password };

  axios.post(`${API_URL}/user/login`, oldUser)
    .then((res) => {
      console.log("Response:", res.data);

      if (res.data.message === "Login successful") {
        showNotification("Welcome back!", "success");

        // ✅ Save token (check the correct key if your backend returns 'token' directly)
        localStorage.setItem('token', res.data.user?.token || res.data.token);

        setTimeout(() => navigate("/home"), 2000);
      } else {
        showNotification(res.data.message || "Invalid credentials", "error");
      }
    })
    .catch((err) => {
      console.error("Error:", err.response ? err.response.data : err);
      showNotification("Login failed. Please check your email or password.", "error");
    });
};







  return (
    <>
      <div className="signin-container">
        <div className="signin-card animate__animated animate__fadeInDown">
          <img
            src={logo}
            alt="Ola Company Logo"
            className="signin-logo-img"
            width={234}
            height={57}
          />
          <form className="signin-form" onSubmit={loginUser}>
            <input
              type="email"
              className="signin-input"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
              name='email'
            />
            <input
              type="password"
              className="signin-input"
              placeholder="Enter your password"
              required
              onChange={(e) => setPassword(e.target.value)}
              name='password'
            />
            <button type="submit" className="signin-btn">
              Sign In
            </button>
          </form>
          <div style={{ margin: '18px 0 0 0', textAlign: 'center', color: '#888' }}>
            or
          </div>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <a href="/signup" className="signin-link">
              Signup
            </a>
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

export default SignInPage;
