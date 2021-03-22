import app from '../../firebase';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';
import { auth } from '../../firebase';
import React, { useRef, useState } from 'react';

const Login = (props) => {
  const passwordRef = useRef();
  const emailRef = useRef();
  const [errorState, setErrorState] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function logIn(e) {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((userCredential) => {
        const user = userCredential.user;
        props.storeCurrentUser(user);
        props.toggelLoggedStatus();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMsg(errorMessage);
        setErrorState(true);
        setTimeout(() => {
          setErrorState(false);
        }, 2000);
      });
  }
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            {errorState && <Alert variant="danger">{errorMsg}</Alert>}
            <Form noValidate onSubmit={logIn}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button disabled={errorState} type="submit" className="w-100">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
