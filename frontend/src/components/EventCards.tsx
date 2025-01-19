import React from "react";
import { useState } from "react";

interface Attendee {
  id: number;
  name: string;
  email: string;
}

interface Props {
  id: number;
  title: string;
  time: string;
  location: string;
  description: string;
  attendees: Attendee[];
}

const EventCards = ({ id, title, time, location, description, attendees }: Props) => {
  const [isRsvped, setIsRsvped] = useState(false);
  const [error, setError] = useState<string>("");

  const handleRSVP = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to RSVP");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/events/${id}/attendees/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to RSVP");
      }

      setIsRsvped(true);
      setError("");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="event-item">
      <div id="short">
        <h3 className="event-title">{title}</h3>
        <p className="event-time">{time}</p>
        <p className="event-location">{location}</p>

        <button 
          className={`view-description-button ${isRsvped ? 'rsvped' : ''}`}
          onClick={handleRSVP}
          disabled={isRsvped}
        >
          {isRsvped ? "RSVPed" : "RSVP"}
        </button>
        {error && <p className="error-message">{error}</p>}
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
