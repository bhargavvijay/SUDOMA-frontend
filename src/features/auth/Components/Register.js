import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { useDispatch, useSelector } from 'react-redux';
import { createUserAsync, resetError, selectError, selectStatus } from '../authSlice';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(selectStatus);
    const error = useSelector(selectError);

    const [formData, setFormData] = useState({
        customerID: '',
        username: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('');

    useEffect(() => {
        if (status === 'succeeded') {
            setVariant('success');
            setMessage('Registration successful! Redirecting...');
            setTimeout(() => navigate('/login'), 2000); // Redirect after a short delay
        }

        if (status === 'failed') {
            setVariant('danger');
            setMessage(error || 'Registration failed. Please try again.');
        }
    }, [status, error, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(createUserAsync(formData));
    };

    useEffect(() => {
        return () => {
            dispatch(resetError()); // Reset error when component unmounts
        };
    }, [dispatch]);

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Create Account</h2>
                <p className="subtitle">Join us today! Please fill in the details below.</p>

                {message && (
                    <div className={`message ${variant}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="customerID">Customer ID</label>
                        <input
                            type="text"
                            id="customerID"
                            name="customerID"
                            placeholder="Enter Customer ID"
                            value={formData.customerID}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
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
                            placeholder="Choose a username"
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
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`submit-button ${status === 'loading' ? 'loading' : ''}`}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="login-link">
                    Already have an account? <a href="/login">Log in</a>
                </div>
            </div>
        </div>
    );
}

export default Register;
