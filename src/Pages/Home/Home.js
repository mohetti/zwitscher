import React, { useEffect, useState } from 'react';
import app, { auth } from '../../firebase';
import './home.css';
import { Button } from 'react-bootstrap';

import Messages from './Messages';
import Feed from './Feed';
import Nav from '../Nav/Nav';
import Explore from './Explore';
import Profile from './Profile';

import 'firebase/database';
import firebase from 'firebase/app';

function Home(props) {
  const [navExplore, setNavExplore] = useState(false);
  const [navFeed, setNavFeed] = useState(true);
  const [navProfile, setNavProfile] = useState(false);
  const [currentPerson, setCurrentPerson] = useState();
  const [otherAccounts, setOtherAccounts] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        app
          .firestore()
          .collection('accounts')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (user.uid !== doc.id) {
                setOtherAccounts((old) => [...old, doc.data()]);
              } else {
                setCurrentPerson(doc.data());
              }
            });
          })
          .catch((error) => {
            console.log('Error getting documents: ', error);
          });
      } else {
        setCurrentPerson();
      }
    });

    return setCurrentPerson(), setOtherAccounts([]);
  }, []);

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

  function navToExplore() {
    setNavExplore(true);
    setNavFeed(false);
    setNavProfile(false);
    return;
  }

  function navToHome() {
    setNavExplore(false);
    setNavFeed(true);
    setNavProfile(false);
    return;
  }

  function navToProfile() {
    setNavExplore(false);
    setNavFeed(false);
    setNavProfile(true);
    return;
  }

  function followUser(event) {
    const followingRef = app
      .firestore()
      .collection('accounts')
      .doc(auth.currentUser.uid);
    followingRef.update({
      following: firebase.firestore.FieldValue.arrayUnion(event.target.id),
    });
    let storeArray = currentPerson.following;
    storeArray.push(event.target.id);
    setCurrentPerson({
      ...currentPerson,
      following: storeArray,
    });

    const followerRef = app
      .firestore()
      .collection('accounts')
      .doc(event.target.id);
    followerRef.update({
      followedBy: firebase.firestore.FieldValue.arrayUnion(
        auth.currentUser.uid
      ),
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
          <div className="col">
            <Nav
              navToExplore={navToExplore}
              navToHome={navToHome}
              navToProfile={navToProfile}
            />
          </div>
          <div className="col-6">
            {navFeed === true ? (
              <div>
                <h2>Home</h2>
                <Messages
                  currentPerson={currentPerson}
                  otherAccounts={otherAccounts}
                />
                <Feed
                  currentPerson={currentPerson}
                  otherAccounts={otherAccounts}
                />
              </div>
            ) : navExplore === true ? (
              <div>
                <h2>Explore</h2>
                <Messages
                  currentPerson={currentPerson}
                  otherAccounts={otherAccounts}
                />

                <Explore
                  otherAccounts={otherAccounts}
                  currentPerson={currentPerson}
                  followUser={followUser}
                />
              </div>
            ) : (
              <div>
                <h2>
                  {currentPerson === undefined
                    ? 'Your Profile'
                    : currentPerson.name}
                </h2>
                <Profile currentPerson={currentPerson} />
              </div>
            )}
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
