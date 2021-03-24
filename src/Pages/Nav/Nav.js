import React from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
import './nav.css';

function Nav(props) {
  return (
    <div>
      <div id="home" onClick={props.navToHome}>
        Home
      </div>
      <div id="explore" onClick={props.navToExplore}>
        Explore
      </div>
      <div id="profile" onClick={props.navToProfile}>
        Profile
      </div>
      <div>Tweet</div>
    </div>
  );
}

export default Nav;
