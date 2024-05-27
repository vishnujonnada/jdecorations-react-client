import React, { useState } from 'react';
import axios from 'axios';


const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { mobile, password });
      // Handle successful login (e.g., save token, redirect)
      console.log(response.data);
      // Assuming the response contains a token, you can save it in localStorage
      localStorage.setItem('token', response.data.token);
      // Redirect to the homepage
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mobile:</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>New? <a href='/signup'>Signup</a></p>
    </div>
  );
};

export default Login;
