import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "./Map";
import Event from "./components/Event";
import EventCards from "./components/EventCards"

const View = () => {
  const [ events, setEvents ] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/events");
        if (response.ok) {
          const data = await response.json();
          const eventInstances = data.map(
            (event: any) =>
              new Event(
                event.id,
                event.title,
                event.start_time,
                event.end_time,
                event.location,
                event.details,
                event.attendees
              )
          );
          setEvents(eventInstances);
        } else {
          console.error("failed to fetch events");
        }
      } catch (error) {
        console.error("error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleBackToHome = () => {
    navigate("/Home");
  };

  return (
    <div className="container">
      <div className="map-container">
        <div id="map">
          <Map
            xCoordinate={49.2624}
            yCoordinate={-123.2451}
            events={events.map((event) => ({
              id: event.id,
              location: event.location,
              title: event.title,
            }))}
          />
        </div>
      </div>

      <div className="event-list">
        <h1>Events</h1>
        <div className="event-cards-container">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCards
                key={event.id}
                id={event.id}
                title={event.title}
                time={`${new Date(event.start_time).toLocaleTimeString()} - ${new Date(event.end_time).toLocaleTimeString()}`}
                location={event.location}
                description={event.details || "No description available"}
                attendees={event.attendees}
              />
            ))
          ) : (
            <p>No events available</p>
          )}
        </div>
        <button onClick={handleBackToHome} className="back-button">
          Back to Home Page
        </button>
      </div>
    </div>
  );
};

export default View;
