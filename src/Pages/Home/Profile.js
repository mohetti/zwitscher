import React, { useRef, useState, useEffect } from 'react';
import app, { auth, storage } from '../../firebase';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';

function Profile(props) {
  const [profilePic, setProfilePic] = useState('');
  const [newImg, setNewImg] = useState(null);
  const [edit, setEdit] = useState(false);
  const bioRef = useRef();

  useEffect(() => {
    if (props.currentPerson.img === '') {
      const storageRef = storage.ref('default/default.png');
      const sampleImg = storageRef
        .getDownloadURL()
        .then((result) => setProfilePic(result));
    } else {
      setProfilePic(props.currentPerson.img);
    }
  }, []);

  function openEditProfile() {
    return setEdit(true);
  }

  function uploadToStorage() {
    if (newImg !== null) {
      const uploadTask = storage
        .ref(auth.currentUser.uid + '/' + newImg.name)
        .put(newImg);
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref(auth.currentUser.uid)
            .child(newImg.name)
            .getDownloadURL()
            .then((url) => {
              setProfilePic(url);
              props.currentPerson.img = url;
              app
                .firestore()
                .collection('accounts')
                .doc(auth.currentUser.uid)
                .update({
                  img: url,
                });
              setNewImg(null);
            });
        }
      );
    }
  }

  function submitChanges() {
    uploadToStorage();
    let storeValue = bioRef.current.value;
    props.currentPerson.bio = bioRef.current.value;
    app
      .firestore()
      .collection('accounts')
      .doc(auth.currentUser.uid)
      .update({
        bio: bioRef.current.value,
      })
      .catch((error) => {
        props.currentPerson.bio = storeValue;
        alert(error);
      });

    return setEdit(false);
  }

  function listenForImg(event) {
    setNewImg(event.target.files[0]);
  }

  return (
    <Card>
      <Card.Body>
        <div style={{ height: '200px' }}>
          <div className="d-flex flex-row justify-content-between">
            <div>
              <img
                style={{
                  height: '100px',
                  width: '100px',
                  borderRadius: '50px',
                }}
                src={profilePic}
                alt="profile"
              />
            </div>
            <div>
              {edit === false ? (
                <Button onClick={openEditProfile}>Edit Profile</Button>
              ) : (
                <div className="d-flex flex-column">
                  <Button onClick={submitChanges}>Submit Changes</Button>
                  <input
                    onChange={listenForImg}
                    type="file"
                    className="mt-2 form-controle-file"
                  />
                </div>
              )}
            </div>
          </div>
          {edit === false ? (
            <div className="mt-3">
              {props.currentPerson.bio === '' ? 'Bio' : props.currentPerson.bio}
            </div>
          ) : (
            <div className="mt-4">
              <Form>
                <Form.Group>
                  <Form.Control
                    defaultValue={props.currentPerson.bio}
                    type="text"
                    ref={bioRef}
                  ></Form.Control>
                </Form.Group>
              </Form>
            </div>
          )}
          <div
            className={edit ? 'mt-4 d-flex flex-row' : 'mt-5 d-flex flex-row'}
          >
            <div>{props.currentPerson.following.length} Following</div>
            <div className="ml-2">
              {props.currentPerson.followedBy.length} Followers
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Profile;
