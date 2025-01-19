import React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from './Map';
import './styles.css';

const Host = () => {
  const navigate = useNavigate();
  const [ eventTitle, setEventTitle ] = useState('');
  const [ startTime, setStartTime ] = useState('');
  const [ endTime, setEndTime ] = useState('');
  const [ eventLocation, setEventLocation ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ error, setError ] = useState('');
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!eventTitle || !startTime || !endTime || !eventLocation) {
      setError('Please fill in all required fields');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Please log in to create an event');
      return;
    }

    setIsSubmitting(true);

    const today = new Date().toISOString().split('T')[0];
    const startDateTime = `${today}T${startTime}:00`;
    const endDateTime = `${today}T${endTime}:00`;

    try {
      const response = await fetch('http://localhost:4000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: eventTitle,
          start_time: startDateTime,
          end_time: endDateTime,
          location: eventLocation,
          details: description,
          creator_id: parseInt(userId),
          attendee_ids: []
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }

      navigate('/View');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapProps = useMemo(() => ({
    xCoordinate: 49.2624,
    yCoordinate: -123.2451,
    events: []
  }), []);

  return (
    <div className="container">
      <div className="form-container">
        <h1>Host Event</h1>
        
        <div className="form-group">
          <label htmlFor="eventTitle">Event Title:</label>
          <input
            type="text"
            id="eventTitle"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventLocation">Event Location:</label>
          <input
            type="text"
            id="eventLocation"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Event...' : 'Create Event'}
        </button>
      </div>

      <div className="map-container">
        <div id="map">
          <Map {...mapProps} />
        </div>
      </div>
    </div>
  );
};

export default Host;
