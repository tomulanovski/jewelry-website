// Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register () {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleRegister(event){
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/register', {
                username,
                email,
                password,
            });
            console.log('User registered:', response.data);
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;