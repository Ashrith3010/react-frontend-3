import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',  // Changed from identifier to username
        password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError('');
        setMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,  // Ensure we send username
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', data.userType);
                localStorage.setItem('username', data.username);

                setMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('Server error. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="in-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"  // Changed from identifier to username
                        value={formData.username}  // Changed from identifier to username
                        onChange={handleChange}
                        placeholder="Username / Email / Phone"
                        required
                        className="form-input"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="form-input"
                    />
                    <button type="submit" className="submit-button">
                        Login
                    </button>
                </form>
                <p className="switch-form">
                    <a href="/register">Create Account</a> | <a href="#">Forgot Password?</a>
                </p>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
            </div>
        </div>
    );
};

export default Login;