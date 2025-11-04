import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();

  // Colors to match the application's existing color scheme
  const colors = {
    pink: '#ee3f65',
    lightPink: '#ffedf1',
    gray: '#a6a8ab',
    darkGray: '#666666'
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 100px)',
      padding: '40px 20px',
      backgroundColor: '#f9f9f9',
      textAlign: 'center'
    },
    iconContainer: {
      backgroundColor: colors.lightPink,
      borderRadius: '50%',
      width: '120px',
      height: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: colors.darkGray,
      marginBottom: '16px'
    },
    message: {
      fontSize: '16px',
      color: colors.gray,
      maxWidth: '500px',
      marginBottom: '40px',
      lineHeight: '1.6'
    },
    button: {
      backgroundColor: colors.pink,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 6px rgba(238, 63, 101, 0.1)'
    },
    backLink: {
      color: colors.gray,
      marginTop: '16px',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.iconContainer}>
        <Lock size={60} color={colors.pink} />
      </div>
      
      <h1 style={styles.title}>Access Denied</h1>
      
      <p style={styles.message}>
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      
      <button 
        style={styles.button}
        onClick={handleGoHome}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#d52e52'; // Darker shade on hover
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = colors.pink;
          e.target.style.transform = 'translateY(0)';
        }}
      >
        Go to Home
      </button>
      
      <p 
        style={styles.backLink}
        onClick={handleGoBack}
        onMouseEnter={(e) => e.target.style.color = colors.pink}
        onMouseLeave={(e) => e.target.style.color = colors.gray}
      >
        Go back to previous page
      </p>
    </div>
  );
};

export default AccessDenied;