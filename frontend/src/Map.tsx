import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

interface Props {
  xCoordinate: number;
  yCoordinate: number;
  events: {
    id: number;
    location: string;
    title: string;
  }[];
}

const Map = ({ xCoordinate, yCoordinate, events }: Props) => {
  useEffect(() => {
    const map = L.map("mapContainer").setView([xCoordinate, yCoordinate], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const addMarkers = async () => {
      for (const event of events) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              event.location
            )}`
          );
          const data = await response.json();

          if (data.length > 0) {
            const { lat, lon } = data[0];
            const marker = L.marker([parseFloat(lat), parseFloat(lon)])
              .addTo(map)
              .bindPopup(`<b>${event.title}</b><br>${event.location}`);
          } else {
            console.error(`Could not geocode location: ${event.location}`);
          }
        } catch (error) {
          console.error(`Error geocoding location: ${event.location}`, error);
        }
      }
    };

    addMarkers();

    return () => {
      map.remove();
    };
  }, [xCoordinate, yCoordinate, events]);

  return (
    <div>
      <div id="mapContainer" style={{ width: "65vw", height: "100vh" }} />
    </div>
  );
};

export default Map;
