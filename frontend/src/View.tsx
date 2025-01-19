import React from "react";
import Map from "./Map";
import Event from "./components/Event"
import EventCards from "./components/EventCards"

let events: Event[] = [];
events.push(new Event("Beach Walk", "3:00pm - 5:00pm", "Jericho Beach", "Sunset Walks! Slow pace"));
events.push(new Event("Movie Night", "6:00pm - 8:00pm", "Highsbury Apt, 6th Ave", "Watching spooky films tonight"));
events.push(new Event("Board games", "7:00pm - 8:00pm", "1710 Dunbar St, W 1st Ave", "Calm card games after dinner"))

/*let block = 
    events.forEach(event => {
        let et = event.title;
        <EventCards title=et 
        
      }); */
const View = () => {
    
  return (
    <>
      <div className="container">
        <div className="map-container">
          <div id="map">
            <Map xCoordinate={49.2624} yCoordinate={-123.2451} />
          </div>

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
          <h1>Events</h1>
          
          <EventCards title="Beach Walk" time="3:00pm - 5:00pm" location="Jericho Beach Park" description="Sunset Walks! Slow pace"></EventCards>
          <EventCards title="Movie Night" time="6:00pm - 8:00pm" location="1710 Dunbar St, W 1st Ave" description="Watching spooky films tonight"></EventCards>
          <EventCards title="Board Games" time="7:30pm - 8:30pm" location="1710 Dunbar St, W 1st Ave" description="After dinner relax"></EventCards>
    
        </div>
      </div>
    </>
  );
};

export default View;
