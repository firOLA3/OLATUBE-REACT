import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI, getProfilePictureUrl } from '../utils/api';
import './UserMenu.css';

function UserMenu() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'firola',
    handle: '@firola3',
    profilePictureUrl: ''
  });
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const data = await userAPI.getProfile();

        if (data.success) {
          setUserData({
            name: data.data.name || 'User',
            handle: data.data.handle ? `@${data.data.handle}` : '@user',
            profilePictureUrl: getProfilePictureUrl(data.data.profilePictureUrl)
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();

    
    window.addEventListener('userDataUpdated', loadUserData);

    return () => {
      window.removeEventListener('userDataUpdated', loadUserData);
    };
  }, []);
  
  const logOut = () => {
    localStorage.removeItem('token');
    navigate("/signin");
  }
  return (
    <div className="user-menu user-menu--dropdown">
      <div className="user-menu__header">
        <div className="user-menu__avatar">
          {userData.profilePictureUrl ? (
            <img 
              src={userData.profilePictureUrl} 
              alt="Profile" 
              className="user-menu__avatar-image"
            />
          ) : (
            userData.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="user-menu__info">
          <div className="user-menu__name">{userData.name}</div>
          <div className="user-menu__handle">{userData.handle}</div>
          <Link to="/userinfo" className="user-menu__view-channel">View your Bio</Link>
        </div>
      </div>

      <div className="user-menu__section">
        <Link to="#" className="user-menu__item">
          <span className="user-menu__icon">G</span>
          <span>Google Account</span>
        </Link>
        <Link to="#" className="user-menu__item">
          <span className="user-menu__icon">⇄</span>
          <span>Switch account</span>
        </Link>
        <div className="user-menu__item" onClick={logOut}>
          <span className="user-menu__icon">⎋</span>
          <span>Sign out</span>
        </div>
      </div>

      <div className="user-menu__section">
        <Link to="#" className="user-menu__item">
          <span className="user-menu__icon">▶</span>
          <span>YouTube Studio</span>
        </Link>
        <Link to="#" className="user-menu__item">
          <span className="user-menu__icon">$</span>
          <span>Purchases and memberships</span>
        </Link>
      </div>

      <div className="user-menu__section">
        <Link to="#" className="user-menu__item">
          <span className="user-menu__icon">🔒</span>
          <span>Your data in YouTube</span>
        </Link>
        <div className="user-menu__item">
          <span className="user-menu__icon">☀</span>
          <span>Appearance: Device theme</span>
        </div>
        <div className="user-menu__item">
          <span className="user-menu__icon">🌐</span>
          <span>Language: English</span>
        </div>
        <div className="user-menu__item">
          <span className="user-menu__icon">🚫</span>
          <span>Restricted Mode: Off</span>
        </div>
        <div className="user-menu__item">
          <span className="user-menu__icon">📍</span>
          <span>Location: Nigeria</span>
        </div>
        <div className="user-menu__item">
          <span className="user-menu__icon">⌘</span>
          <span>Keyboard shortcuts</span>
        </div>
      </div>

      <div className="user-menu__section">
        <div className="user-menu__item">
          <span className="user-menu__icon">⚙</span>
          <span>Settings</span>
        </div>
        <div className="user-menu__item">
          <span className="user-menu__icon">❓</span>
          <span>Help</span>
        </div>
      </div>
    </div>
  );
}

export default UserMenu;


