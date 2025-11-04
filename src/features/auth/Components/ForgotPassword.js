import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordRequestAsync, selectMailSent, selectError, resetError, resetMailSent } from '../authSlice';
import './ForgotPassword.css';

function ForgotPassword() {
  const dispatch = useDispatch();
  const mailSent = useSelector(selectMailSent);
  const error = useSelector(selectError);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (mailSent || error) {
        dispatch(resetError());
        dispatch(resetMailSent());
      }
    };
  }, [dispatch, mailSent, error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    dispatch(resetPasswordRequestAsync({ email })).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="forgotPassword-container">
      <div className="forgotPassword-card">
        <h1 className="title">Forgot Password</h1>
        <p className="subtitle">
          Contact the administrator to change the password.
        </p>

        {/* {!mailSent && (
          <form onSubmit={handleSubmit} className="forgotPassword-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )} */}

        <div className="login-link">
          Remember your password? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
