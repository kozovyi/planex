import React from 'react';
import Login, { Button } from '@react-login-page/page3';
import defaultBannerImage from '@react-login-page/page3/bg.jpeg';
import "../styles/LoginPage.css"

const LoginPage = () => (
  <Login style={{ height: 700 }}>
    <Login.Banner style={{ backgroundImage: `url(${defaultBannerImage})` }} />
    
    <Button keyname="register" type="register">Register</Button>
    <Button keyname="submit" type="submit">Login</Button>
    
    <Login.Password>
      <div>xx</div>
    </Login.Password>
    <Login.Logo>PlaneX</Login.Logo>
  </Login>
);

export default LoginPage ;