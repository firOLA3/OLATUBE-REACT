import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, getProfilePictureUrl } from '../../utils/api';
import './UserInfo.css';

const UserInfo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    profilePicture: null,
    profilePictureUrl: ''
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const data = await userAPI.getProfile();

        if (data.success) {
          setFormData(prev => ({
            ...prev,
            name: data.data.name || '',
            handle: data.data.handle || '',
            profilePictureUrl: getProfilePictureUrl(data.data.profilePictureUrl)
          }));
        } else {
          setError('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile data');
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProfilePicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          profilePicture: file,
          profilePictureUrl: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      const result = await userAPI.deleteAvatar();

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          profilePicture: null,
          profilePictureUrl: ''
        }));
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        window.dispatchEvent(new CustomEvent('userDataUpdated'));
      } else {
        setError('Failed to delete profile picture');
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      setError('Failed to delete profile picture');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      // Update profile info
      const profileResult = await userAPI.updateProfile({
        name: formData.name,
        handle: formData.handle
      });
      
      if (!profileResult.success) {
        throw new Error('Profile update failed: ' + profileResult.message);
      }

      // if profile picture is selected update
      if (formData.profilePicture) {
        try {
          const uploadResult = await userAPI.uploadAvatar(formData.profilePicture);
          
          if (!uploadResult.success) {
            throw new Error('Avatar upload failed: ' + uploadResult.message);
          }
        } catch (uploadError) {
          console.error('Avatar upload error:', uploadError);
          // Check if it's a missing endpoint error
          if (uploadError.message.includes('Cannot POST') || uploadError.message.includes('HTML error page')) {
            setError('Profile updated successfully, but avatar upload is not available. The backend avatar endpoint is missing or not configured.');
          } else {
            setError('Profile updated successfully, but failed to upload profile picture: ' + uploadError.message);
          }
          setLoading(false);
          return; 
        }
      }
      
      window.dispatchEvent(new CustomEvent('userDataUpdated'));
      
      // back to home
      navigate('/home');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-info-container">
      <div className="user-info-header">
        <h1>Channel customization</h1>
        <p>Customize how you appear to viewers across OlaTube</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="user-info-form">
        <div className="form-section">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            className="form-input"
            required
          />
          <p className="form-description">
            Choose a channel name that represents you and your content. Changes made to your name and picture are visible only on YouTube and not other Google services. You can change your name twice in 14 days.
          </p>
        </div>

       
        <div className="form-section">
          <label htmlFor="handle" className="form-label">Handle</label>
          <div className="handle-input-container">
            <span className="handle-prefix">@</span>
            <input
              type="text"
              id="handle"
              name="handle"
              value={formData.handle}
              onChange={handleInputChange}
              placeholder="Set your handle"
              className="form-input handle-input"
              required
            />
          </div>
        </div>

       
        <div className="form-section">
          <label className="form-label">Profile picture</label>
          <div className="profile-picture-section">
            <div className="profile-picture-preview">
              {formData.profilePictureUrl ? (
                <img 
                  src={formData.profilePictureUrl} 
                  alt="Profile preview" 
                  className="profile-picture-image"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  <span>No image selected</span>
                </div>
              )}
            </div>
            
            <div className="profile-picture-buttons">
              <button
                type="button"
                onClick={handleAddProfilePicture}
                className="btn btn-primary"
              >
                Add profile picture
              </button>
              <button
                type="button"
                onClick={handleRemoveProfilePicture}
                className="btn btn-secondary"
                disabled={!formData.profilePictureUrl}
              >
                Delete profile picture
              </button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInfo;
