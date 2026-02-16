import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Login, { Email, Password, Button } from '@react-login-page/page3';
import defaultBannerImage from '@react-login-page/page3/bg.jpeg';
import axios from 'axios';
import "../styles/LoginPage.css";
import { getAccessToken } from '../utils/helpers';
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
      localStorage.setItem("user_email", email);
      console.log('--------------------------------')
      console.log(localStorage.getItem('user_email'))
      console.log('--------------------------------')



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
      

      const data = new URLSearchParams();
      data.append("username", email);
      data.append("password", password);

      const response1 = await axios.post(
        'http://localhost:8000/api/api_v1/auth/login',
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );
      document.cookie = `access_token=${response1.data.access_token}; path=/; max-age=36000; secure`;


      const token = getAccessToken();

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const boards = [
        { title: 'Work tasks', description: 'Tasks related to work' },
        { title: 'Home tasks', description: 'Tasks related to home' },
      ];

      try {
        for (const board of boards) {
          const response = await axios.post(
            'http://localhost:8000/api/api_v1/board/',
            board,
            { headers }
          );

          if (response.data && response.data.id) {
            // можна зберегти останню активну дошку
            localStorage.setItem('active_board', response.data.id);
          }
        }

        setSuccess(true);
        resetFormState();

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error('Error creating board:', error);
      }
      

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
