import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice'; 

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?'); // Confirmation dialog
    if (!confirmLogout) {
      return; // Do nothing if user cancels
    }

    try {
      const response = await fetch('https://sudoma-backend-api.onrender.com/api/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        dispatch(logout()); // Reset user state in Redux
        navigate('/login'); // Redirect to login page
      } else {
        console.error('Failed to logout:', response.statusText);
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout.');
    }
  };

  return (
    <div style={{marginLeft: '50px'}}>
      <h1>You have successfully logged in.</h1><br></br>
    </div>
  );
}

export default Dashboard;
