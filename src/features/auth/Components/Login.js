import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure this file contains styles for alerts
import { useDispatch, useSelector } from 'react-redux';
import { loginUserAsync } from '../authSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    customerID: '',
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const error = useSelector((state) => state.auth.error);
  const status = useSelector((state) => state.auth.status);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    console.log("Login form submitted with data:", formData);
    event.preventDefault();
    setIsLoading(true);
    dispatch(loginUserAsync(formData)).finally(() => setIsLoading(false));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Please log in to continue</p>

        {/* Display error message */}
        {error && (
          <div className="alert alert-danger">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="customerID">Customer ID</label>
            <input
              type="text"
              id="customerID"
              name="customerID"
              placeholder="Enter your Customer ID"
              value={formData.customerID}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Link to="/forgot-password">
            <div className="forgot-password">Forgot Password?</div>
          </Link>

          <button
            type="submit"
            style={{ backgroundColor: '#ee3F65' }}
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;
