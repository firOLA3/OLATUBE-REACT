// src/Components/Navbar/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react'
import './Navbar.css'
import menu_icon from '../../assets/menu.png'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search.png'
import upload_icon from '../../assets/upload.png'
import more_icon from '../../assets/more.png'
import notification_icon from '../../assets/notification.png'
// import profile_icon from '../../assets/jack.png'
import { Link } from 'react-router-dom'
import ola from '../../assets/olalogo.png'
import profile from '../../assets/olapro.png'
import UserMenu from '../UserMenu'
import { userAPI, getProfilePictureUrl, subscriptionAPI } from '../../utils/api'

const Navbar = ({setSidebar, setSearchQuery, searchQuery}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState({
    profilePictureUrl: ''
  });
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const userMenuRef = useRef(null);
  const profileIconRef = useRef(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const data = await userAPI.getProfile();

        if (data.success) {
          setUserData({
            profilePictureUrl: getProfilePictureUrl(data.data.profilePictureUrl)
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();

    // listen if user info changes
    const handleStorageChange = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // tab updates
    window.addEventListener('userDataUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleStorageChange);
    };
  }, []);

  // Load notification count
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const data = await subscriptionAPI.getSubscriptions();
        if (data.success) {
          setUnreadNotifications(data.unreadNotifications);
          localStorage.setItem('unreadNotifications', data.unreadNotifications);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();

    
    const handleSubscriptionUpdate = () => {
      const count = parseInt(localStorage.getItem('unreadNotifications') || '0');
      setUnreadNotifications(count);
    };

    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);

    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target) && 
          profileIconRef.current && !profileIconRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleNotificationClick = async () => {
    // notification reset
    try {
      await subscriptionAPI.resetNotifications();
      setUnreadNotifications(0);
      localStorage.setItem('unreadNotifications', '0');
    } catch (error) {
      console.error('Error resetting notifications:', error);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <nav className='flex-div'>
      <div className='nav-left flex-div'>
        <img className='menu-icon' onClick={()=>setSidebar(prev=>prev===false?true:false)} src={menu_icon} alt='' />
        {/* <Link to='/'><img className='logo' src={logo} alt='' /></Link> */}
        
        <Link to='/home'><img src={ola} className='ola-logo'/></Link>
      </div>

      <div className='nav-middle flex-div'>
        <div className='search-box flex-div'>
          <input
            type='text'
            placeholder='Search'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <img src={search_icon} onClick={handleSearch} style={{cursor: 'pointer'}} />
        </div>
      </div>

      <div className='nav-right flex-div'>
        <Link to='/indevelopment'><img src={upload_icon} alt="" /></Link>
        <Link to='/indevelopment'><img src={more_icon} alt="" /></Link>
        <div className='notification-container' onClick={handleNotificationClick}>
          <img src={notification_icon} alt="" />
          {unreadNotifications > 0 && <span className='notification-count'>{unreadNotifications}</span>}
        </div>
        {/* <img src={profile_icon} className='user-icon' alt="" /> */}
        <div className='user-menu-container' ref={userMenuRef}>
          <img 
            ref={profileIconRef}
            src={userData.profilePictureUrl || profile} 
            className='user-icon' 
            alt=''
            onClick={toggleUserMenu}
          />
          {showUserMenu && <UserMenu />}
        </div>
      </div>


    </nav>
  )
}

export default Navbar
