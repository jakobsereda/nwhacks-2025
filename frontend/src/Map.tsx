import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

const Map = () => {
  useEffect(() => {
    // Create map instance inside useEffect
    const map = L.map('mapContainer').setView([49.2624, -123.2451], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Cleanup function to remove map when component unmounts
    return () => {
      map.remove();
    };
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div>
      <div id="mapContainer" style={{ width: '600px', height: '400px' }} />
    </div>
  );
};

export default Map;