import { Button } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import React, { useEffect } from 'react';

function Landing(props) {
  useEffect(() => {
    props.resetGoToLogin();
  }, []);
  return (
    <div>
      <Route
        render={({ history }) => (
          <Button
            onClick={() => {
              history.push('/login');
            }}
            className="w-100"
          >
            Login
          </Button>
        )}
      />
      <Route
        render={({ history }) => (
          <Button
            onClick={() => {
              history.push('/signup');
            }}
            className="w-100"
          >
            Sign Up!
          </Button>
        )}
      />
    </div>
  );
}

export default Landing;
