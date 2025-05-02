import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Login, { Email, Password, Button } from '@react-login-page/page3';
import defaultBannerImage from '@react-login-page/page3/bg.jpeg';
import axios from 'axios';
import "../styles/LoginPage.css";
import { getCookie } from "../utils/helpers";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async () => {
    try {
      const data = new URLSearchParams();
      data.append("username", email);
      data.append("password", password);

      const response = await axios.post(
        'http://localhost:8000/api/api_v1/auth/login',
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );
      document.cookie = `access_token=${response.data.access_token}; path=/; max-age=36000; secure`;
      

      navigate('/');
      // localStorage.setItem("token", response.data.access_token);
    } catch (error) {
      alert(`Login error. Check email or password`);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/api_v1/auth/register', {
        email,
        password,
      });

      alert("Registration success!");
    } catch (error) {
      alert("Registration eror");
    }
  };

  return (
    <Login style={{ height: 700 }}>
      <Login.Banner style={{ backgroundImage: `url(${defaultBannerImage})` }} />

      <Email index={1} value={email} onChange={e => setEmail(e.target.value)} />
      <Password index={2} value={password} onChange={e => setPassword(e.target.value)} />

      <Button keyname="submit" type="submit" onClick={handleLogin}>Login</Button>
      <Button keyname="register" type="register" onClick={handleRegister}>Register</Button>

      <Login.Logo>PlaneX</Login.Logo>
    </Login>
  );
};

export default LoginPage;
