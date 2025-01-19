import React from "react";

interface Props {
  title: string;
  time: string;
  location: string;
  description: string;
}

const EventCards = ({ title, time, location, description }: Props) => {
  return (
    <>
      <div className="event-item">
        <div id="short">
          <h3 className="event-title">{title}</h3>
          <p className="event-time">{time}</p>
          <p className="event-location">{location}</p>

          <button className="view-description-button">RSVP</button>
        </div>
        <p className="description">{description}</p>
      </div>
    </>
  );
};

export default EventCards;
