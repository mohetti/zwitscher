import { Card, Container } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/database';
import app from '../../firebase';
import React, { useState, useEffect } from 'react';
import uniqid from 'uniqid';

function Feed(props) {
  const [feedMsgs, setFeedMsgs] = useState([]);
  useEffect(() => {
    if (props.currentPerson === undefined) {
      return;
    } else if (props.currentPerson.following.length === 0) {
      return;
    } else {
      const msgRef = app
        .firestore()
        .collection('messages')
        .where('uid', 'in', props.currentPerson.following)
        .orderBy('createdAt')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //console.log(doc.id, ' => ', doc.data());
            setFeedMsgs((old) => [...old, doc.data()]);
          });
        });
      return setFeedMsgs([]);
    }
  }, [props.currentPerson]);

  function feedMsgAccountName(id) {
    let target = props.otherAccounts.filter((key) => key.uid === id.uid);
    return target[0].name;
  }

  function feedMsgProfilePic(id) {
    let target = props.otherAccounts.filter((key) => key.uid === id.uid);
    return target[0].img;
  }

  function feedMsgTime(id) {
    let date = id.createdAt.toDate();
    console.log(date.getFullYear());
    return (
      date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
    );
  }

  const content = feedMsgs.map((el) => (
    <div key={uniqid()}>
      <div className="d-flex">
        <div className="ml-3">
          <img
            style={{
              height: '50px',
              width: '50px',
              borderRadius: '25px',
            }}
            src={feedMsgProfilePic(el)}
          />
        </div>
        <div>{feedMsgAccountName(el)}</div>
        <div>{feedMsgTime(el)}</div>
      </div>
      <section className="mt-4 ml-3">{el.msg}</section>
      <hr />
    </div>
  ));
  return (
    <div className="mt-5">
      <Container>
        <Card>{content}</Card>
      </Container>
    </div>
  );
}

export default Feed;
