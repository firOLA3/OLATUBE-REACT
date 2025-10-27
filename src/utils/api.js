// for backend integration

const API_BASE_URL = 'http://localhost:5001';


const getAuthToken = () => {
  return localStorage.getItem('token');
};


const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

export const userAPI = {
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If JSON parsing fails, use the status message
          }
        } else {
          try {
            const errorText = await response.text();
            if (errorText.includes('<!DOCTYPE')) {
              errorMessage = `Server returned HTML error page. Check if backend server is running on ${API_BASE_URL}`;
            } else {
              errorMessage = errorText;
            }
          } catch (e) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
      }
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      // Check if response is ok
      if (!response.ok) {
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            
          }
        } else {
          
          try {
            const errorText = await response.text();
            if (errorText.includes('<!DOCTYPE')) {
              errorMessage = `Server returned HTML error page. Check if backend server is running on ${API_BASE_URL}`;
            } else {
              errorMessage = errorText;
            }
          } catch (e) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
      }
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch(`${API_BASE_URL}/api/user/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If JSON parsing fails, use the status message
          }
        } else {
          try {
            const errorText = await response.text();
            if (errorText.includes('<!DOCTYPE')) {
              errorMessage = `Server returned HTML error page. Check if backend server is running on ${API_BASE_URL}`;
            } else {
              errorMessage = errorText;
            }
          } catch (e) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
      }
      throw error;
    }
  },

  // Delete avatar
  deleteAvatar: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/avatar`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If JSON parsing fails, use the status message
          }
        } else {
          try {
            const errorText = await response.text();
            if (errorText.includes('<!DOCTYPE')) {
              errorMessage = `Server returned HTML error page. Check if backend server is running on ${API_BASE_URL}`;
            } else {
              errorMessage = errorText;
            }
          } catch (e) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
      }
      throw error;
    }
  }
};

// Comment APIs
export const commentAPI = {
  postComment: async (videoId, commentText) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ videoId, commentText })
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
      }
      throw error;
    }
  },

  getComments: async (videoId, page = 1, limit = 20) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${videoId}?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
      }
      throw error;
    }
  }
};

// function to get full URL for profile pictures
export const getProfilePictureUrl = (profilePictureUrl) => {
  if (!profilePictureUrl) return '';
  if (profilePictureUrl.startsWith('http')) return profilePictureUrl;
  return `${API_BASE_URL}${profilePictureUrl}`;
};

// Subscription APIs
export const subscriptionAPI = {
  subscribe: async (channelData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/subscribe`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(channelData)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
      }
      throw error;
    }
  },

  unsubscribe: async (channelId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/unsubscribe/${channelId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
      }
      throw error;
    }
  },

  getSubscriptions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/subscriptions`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
      }
      throw error;
    }
  },

  resetNotifications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/reset-notifications`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
      }
      throw error;
    }
  }
};
