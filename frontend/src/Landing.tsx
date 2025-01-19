import React from "react";
import Map from "./images/landing-map.png";
import Group from "./images/people.png";
import Heart from "./images/Heart.png";

import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>
      <div className="banner">
        <h1>Out&About</h1>

        <div className="login-button">
            <h2>
            {<Link to={"/Home"}>Log In</Link>}
            </h2></div>
      </div>

      <div id="landing-body">
        <div id="landing-body-text">
          <h2>See what events are happening near you!</h2>

          <div id="icon-row">
            <img src={Group} alt="people-icon" id="icon"></img>
            <h3>Meet New Friends</h3>
          </div>

          <div id="icon-row">
            <img src={Heart} alt="people-icon" id="icon"></img>
            <h3>Join the local community</h3>
          </div>

          <div id="cta-section">
            <h1>
              Find activities <br />
              you'll love
            </h1>

            <div id="signup-button">
              <h3>{<Link to={"/"}>Sign Up</Link>}</h3>
            </div>
          </div>
        </div>
        <img src={Map} alt="Map Pic" className="general-image" />
      </div>
    </>
  );
};

export default Landing;
