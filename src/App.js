import './App.css';
import 'firebase/firestore';

import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Nav from './Pages/Nav/Nav';
import Landing from './Pages/Landing/Landing';
import SignUp from './Pages/Login/SignUp';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import app, { auth } from './firebase';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [currentSession, setCurrentSession] = useState();
  const [navToLogin, setNavToLogin] = useState();

  function toggelLoggedStatus() {
    return setLoggedIn(!loggedIn);
  }
  function storeCurrentUser(userCreds) {
    return setCurrentUser(userCreds);
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        const useRef = app.firestore().collection('accounts').doc(uid);
        useRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              setCurrentSession(doc.data());
            } else {
              console.log('No such document!');
            }
          })
          .catch((error) => {
            console.log('Error getting document: ', error);
          });
      } else {
        setCurrentUser();
        setCurrentSession();
      }
    });
    return unsubscribe;
  }, [loggedIn]);

  function goToLogin() {
    setNavToLogin(true);
  }

  function resetGoToLogin() {
    setNavToLogin(false);
  }

  return (
    <Router>
      <div className="App">
        <Route path="/" exact>
          {!currentSession ? (
            <Redirect to="/landing" />
          ) : (
            <Home
              toggelLoggedStatus={toggelLoggedStatus}
              currentSession={currentSession}
              currentUser={currentUser}
            />
          )}
        </Route>
        <Route path="/signup" exact>
          {currentSession ? (
            <Redirect to="/" />
          ) : navToLogin ? (
            <Login
              toggelLoggedStatus={toggelLoggedStatus}
              storeCurrentUser={storeCurrentUser}
            />
          ) : (
            <SignUp
              toggelLoggedStatus={toggelLoggedStatus}
              storeCurrentUser={storeCurrentUser}
              goToLogin={goToLogin}
              resetGoToLogin={resetGoToLogin}
            />
          )}
        </Route>
        <Route path="/login" exact>
          {currentSession ? (
            <Redirect to="/" />
          ) : (
            <Login
              toggelLoggedStatus={toggelLoggedStatus}
              storeCurrentUser={storeCurrentUser}
            />
          )}
        </Route>
        <Route path="/landing" exact>
          {currentSession ? (
            <Redirect to="/" />
          ) : (
            <Landing resetGoToLogin={resetGoToLogin} />
          )}
        </Route>
      </div>
    </Router>
  );
}

export default App;
