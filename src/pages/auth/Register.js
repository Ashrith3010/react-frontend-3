import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        userType: 'donor',
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
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                setMessage(data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Server error. Please try again.');
        }
    };

    return (
        <div className="register-page">
            <div className="container1">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
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
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        className="form-input"
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className="form-input"
                    />
                    <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        required
                        className="form-select"
                    >
                        <option value="donor">Donor</option>
                        <option value="ngo">NGO</option>
                    </select>
                    {formData.userType === 'ngo' && (
<>
<input
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            placeholder="Organization Name"
                            required
                        />
<input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="Service Area"
                            required
                        />
</>
                )}
                    <button type="submit" className="submit-button">Register</button>
                </form>
                <p className="switch-form">
                    Already have an account? <a href="/login">Login</a>
                </p>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
            </div>
        </div>
    );
};

export default Register;
