import React from "react";

interface Attendee {
  id: number;
  name: string;
  email: string;
}

interface Props {
  title: string;
  time: string;
  location: string;
  description: string;
  attendees: Attendee[];
}

const EventCards = ({ title, time, location, description, attendees }: Props) => {
  return (
    <div className="event-item">
      <div id="short">
        <h3 className="event-title">{title}</h3>
        <p className="event-time">{time}</p>
        <p className="event-location">{location}</p>

        <button className="view-description-button">RSVP</button>
      </div>
      <p className="description">{description}</p>

      {attendees.length > 0 && (
        <div className="attendees-list">
          <h4>Attendees:</h4>
          <ul>
            {attendees.map((attendee) => (
              <li key={attendee.id}>
                {attendee.name} ({attendee.email})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventCards;
