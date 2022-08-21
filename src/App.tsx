import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { Button, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import UserInfo from './UserInfo';

function App() {
  const style = {
    width: '100%',
  };
  return (
    <div className="App">
      <Stack style={{ padding: 15 }}>
        <Link to="sign-up">
          <Button colorScheme="facebook" style={style}>
            Sign Up
          </Button>
        </Link>

        <Link to="sign-in">
          <Button colorScheme="facebook" style={style}>
            Sign In
          </Button>
        </Link>
        <UserInfo />
      </Stack>
    </div>
  );
}

export default App;
