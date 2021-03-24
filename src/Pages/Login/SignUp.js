import React, { useRef, useState, useEffect } from 'react';
import app, { auth, storage } from '../../firebase';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';

const SignUp = (props) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const userNameRef = useRef();
  const [errorState, setErrorState] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    props.resetGoToLogin();
  }, []);

  function signUp(e) {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        const following = [];
        const followedBy = [];
        const name = userNameRef.current.value;
        const msg = true;
        const messages = [];
        const img = '';
        const email = emailRef.current.value;

        props.toggelLoggedStatus();
        props.storeCurrentUser(user);

        const account = { uid, name, following, followedBy, email, img };
        console.log(account);
        const msgObj = { messages };
        app.firestore().collection('messages').doc(uid).set(msgObj);

        app.firestore().collection('accounts').doc(uid).set(account);
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
            <h2 className="text-center mb-4">Sign Up</h2>
            {errorState && <Alert variant="danger">{errorMsg}</Alert>}
            <Form onSubmit={signUp}>
              <Form.Group id="email">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" ref={userNameRef} required />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group id="passwordConfirm">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={confirmPasswordRef}
                  required
                />
              </Form.Group>
              <Button disabled={errorState} type="submit" className="w-100">
                Sign Up
              </Button>
            </Form>
          </Card.Body>
          <div className="w-100 text-center mt-2">
            Already haven an account?{' '}
            <div className="btn" onClick={props.goToLogin}>
              Login
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default SignUp;
