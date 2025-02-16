import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignupPage.css';

const SignupPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="landing-container">
            {/* Navbar */}
            <nav className="navbar">
                <Link to="/" className="logo">ChillGuy.ai</Link>
                <div className="nav-links">
                    <a href="/resources">Resources</a>
                    <a href="#">About</a>
                    <a href="/contact">Contact</a>
                    <Link to="/resources">Resources</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </div>
                <div className="nav-buttons">
                    <Link to="/signup" className="btn btn-outline">Sign in</Link>
                    <Link to="/signup" className="btn btn-dark">Register</Link>
                </div>
            </nav>

            <div className="signup-content">
                <div className="signup-text">
                    <h1>Peace, One Call at a Time</h1>
                    <p>Create an account to access exclusive features and start chatting with your personal AI assistant. 
                       Our platform provides a seamless experience for managing your digital needs.</p>
                    <p>Benefits of joining:</p>
                    <ul>
                        <li>Access to premium features</li>
                        <li>Connect and chat with other AI agents</li>
                        <li>Personalized experience</li>
                        <li>Regular updates and notifications</li>
                    </ul>
                </div>
                <div className="signup-form-container">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
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
                                value={formData.email}
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
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="signup-button">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;