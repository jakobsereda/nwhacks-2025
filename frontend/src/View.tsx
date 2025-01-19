import React from "react";
import Map from "./Map";

const View = () => {
  return (
    <>    
      <div className="container">
        <div className="map-container">
            <Map/>
          {/*<img src="path/to/your/map.jpg" alt="Map of Jericho Beach">*/}
          <div
            className="event-marker"
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
            }}
          ></div>
          <div
            className="event-marker"
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
            }}
          ></div>
          <div
            className="event-marker"
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
            }}
          ></div>
        </div>

        <div className="event-list">
          <h2>Events</h2>
          <div className="event-item">
            <h3 className="event-title">Beach Walk</h3>
            <p className="event-time">3:00pm - 5:00pm</p>
            <p className="event-location">Jericho Beach Park</p>
            <button className="view-description-button">
              View Description
            </button>
          </div>
          <div className="event-item">
            <h3 className="event-title">Movie Night</h3>
            <p className="event-time">6:00pm - 8:00pm</p>
            <p className="event-location">Highsbury Apt, 6th Ave</p>
            <button className="view-description-button">
              View Description
            </button>
          </div>
          <div className="event-item">
            <h3 className="event-title">Board Games</h3>
            <p className="event-time">3:00pm - 5:00pm</p>
            <p className="event-location">1710 Dunbar St, W 1st Ave</p>
            <button className="view-description-button">
              View Description
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
