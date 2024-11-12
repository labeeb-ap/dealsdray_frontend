import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import logo from './logo.png';

const LoginPage = () => {
   const [username, setusername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate(); 

   const handleusernameChange = (e) => {
      setusername(e.target.value);
   };

   const handlePasswordChange = (e) => {
      setPassword(e.target.value);
   };

   
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!username || !password) {
         setError('Please fill in both fields.');
         return;
      }
      
      try {
         const response = await fetch('http://localhost:3000/login/userlogin', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({ username, password })
         });
         
         if (response.ok) {
           const data = await response.json();
           console.log(data);

           if (data.success) {
            localStorage.setItem('username', JSON.stringify(data.data.username));
              navigate('/Home');
           } else {
              setError('Invalid username or password.');
           }
         } else {
           setError('Login failed: Unable to reach server.');
         }
      } catch (error) {
         console.error('Login request error:', error);
         setError('An error occurred during login.');
      }

      setusername('');
      setPassword('');
   };

   return (
      <div className="login-container">
         <img src={logo} alt="Logo" className="login-logo" /> 
         <h2>Login</h2>
         {error && <p className="error-message">{error}</p>}
         <form onSubmit={handleSubmit}>
            <div className="form-group">
               <label>Username:</label>
               <input
                  type="text"
                  value={username}
                  onChange={handleusernameChange}
                  placeholder="Enter your username"
                  required
               />
            </div>
            <div className="form-group">
               <label>Password:</label>
               <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  required
               />
            </div>
            <button type="submit">Login</button>
         </form>
      </div>
   );
};

export default LoginPage;
