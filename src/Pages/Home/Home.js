import React, { useEffect } from 'react';
import { auth } from '../../firebase';
import './home.css';
import { Link } from 'react-router-dom';
import app from '../../firebase';
import { propTypes } from 'react-bootstrap/esm/Image';
import { Button } from 'react-bootstrap';

import Messages from './Messages';
import Feed from './Feed';

function Home(props) {
  function signOut() {
    auth
      .signOut()
      .then(() => {
        props.toggelLoggedStatus();
      })
      .catch((error) => {
        // An error happened.
      });
  }

  return props.currentSession === undefined ? (
    <div>
      <h1>Loading...</h1>
    </div>
  ) : (
    <div>
      <div className="container">
        <div className="row">
          <div className="col">First Part</div>
          <div className="col-6">
            <h2>Home</h2>
            <Messages currentUser={props.currentUser} />
            <Feed />
          </div>
          <div className="col">
            <Button onClick={signOut}>Log Out</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
