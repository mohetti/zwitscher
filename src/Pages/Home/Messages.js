import { Card, Form, Button, Container, Alert } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import app from '../../firebase';
import firebase from 'firebase/app';
import 'firebase/database';
function Messages(props) {
  const msgRef = useRef();
  const [errorMsg, setErrorMsg] = useState('');
  const [inputError, setInputError] = useState(false);

  function postMsg(e) {
    e.preventDefault();
    if (msgRef.current.value === '') {
      setInputError(true);
      setErrorMsg('Enter a Message to post something.');
      setTimeout(() => {
        setInputError(false);
        setErrorMsg('');
      }, 2000);
    } else if (msgRef.current.value.length >= 250) {
      setInputError(true);
      setErrorMsg('Your message is too long. Only 250 characters allowed.');
      setTimeout(() => {
        setInputError(false);
        setErrorMsg('');
      }, 2000);
    } else {
      const storeMsgTarget = app
        .firestore()
        .collection('messages')
        .doc(props.currentUser.uid);
      storeMsgTarget.update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          msg: msgRef.current.value,
          timeStamp: firebase.database.ServerValue.TIMESTAMP,
        }),
      });
      msgRef.current.value = '';
    }
  }

  return (
    <Card className="mh-100 w-100 d-inline-block" style={{ height: '200px' }}>
      <Card.Body>
        <Form noValidate onSubmit={postMsg}>
          <Form.Group>
            <Form.Control ref={msgRef} type="text" required />
          </Form.Group>
          {inputError && <Alert variant="danger">{errorMsg}</Alert>}
          <Button disabled={inputError} type="submit" className="w-25">
            Post
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Messages;
