// First install these dependencies:
// npm install leaflet react-leaflet

import React, { useContext, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { marker } from "leaflet";
import { MainContext } from "../context/primaryContext";

// Fix for default markers not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create a custom marker icon
const createCustomIcon1 = () => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div class="w-8 h-8 text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="green" stroke="green" stroke-width="0" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3" fill="white" stroke="green"></circle>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const createCustomIcon2 = () => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div class="w-8 h-8 text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="red" stroke="red" stroke-width="0" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3" fill="white" stroke="red"></circle>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const createCustomIcon4 = () => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div class="w-8 h-8 text-green-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="green" stroke="green" stroke-width="0" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <path d="M8 7h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm0 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 7v2m6-2v2" 
              fill="white" 
              stroke="green" 
              stroke-width="1" 
              transform="scale(0.5) translate(12,10)"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};
const createCustomIcon3 = () => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div class="w-8 h-8 text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="yellow" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3" fill="white" stroke="black"></circle>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const getPosition = () => {
  const [currentPosition, setCurrentPosition] = useState([27.71, 85.32]); // Default fallback position

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          setCurrentPosition([
            location.coords.latitude,
            location.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return currentPosition;
};

const BusRouteFinder = () => {
  const {
    markerState,
    setMarkerState,
    getDataFromServer,
    busStops,
    setBusStops,
    majorCheckPoints,
    setMajorCheckPoints,
    polyLine,
    setPolyLine,
    markerPosition,
    setMarkerPosition,
  } = useContext(MainContext);

  console.log(markerState);

  const customIcon1 = createCustomIcon1();
  const customIcon2 = createCustomIcon2();
  const customIcon3 = createCustomIcon3();
  const customIcon4 = createCustomIcon4();
  const [locationName, setLocationName] = useState("");

  // const polyLine = [
  //   {
  //     id: 123,
  //     color: "green",
  //     route: [
  //       [27.7, 83.4],
  //       [27.9, 83.49],
  //     ],
  //   },
  // ];
  // This component handles map events

  const fetchLocationName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      const placeName = data.display_name.split(",").slice(0, 3).join(",");
      setLocationName(data.display_name || "Location not found");

      if (markerState === "confirmed") {
        if (markerPosition.length === 1) {
          setMarkerPosition((prev) => [
            ...prev,
            { type: markerState, lt: lat, ln: lon, namee: placeName },
          ]);
        } else {
          markerPosition.pop();
          setMarkerPosition((prev) => [
            ...prev,
            { type: markerState, lt: lat, ln: lon, namee: placeName },
          ]);
        }

        setDestination(placeName);
      } else {
        setMarkerPosition([
          { type: markerState, lt: lat, ln: lon, namee: placeName },
        ]);
        setSource(placeName);
      }

      // setMajorCheckPoints((prev) => [
      //   ...prev,
      //   { lt: lat, ln: lon, namee: placeName },
      // ]);
      // console.log(placeName, lat, lon);
      // console.log(majorCheckPoints);

      console.log(markerPosition);
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Error fetching location");
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;

        // setPolyLine((prev) => [...prev, [lat, lng]]);

        fetchLocationName(lat, lng);

        // setMarkerPosition((prev) => [
        //   ...prev,
        //   { type: markerState, lt: lat, ln: lng },
        // ])

        console.log(markerPosition);
        console.log(busStops);
      },
    });
    return null;
  };

  // Sample bus route data - replace with your actual data
  const {
    source,
    setSource,
    destination,
    setDestination,
    closeDest,
    setCloseDest,
    closeSource,
    setCloseSource,
    starPoint,
    setStarPoint,
  } = useContext(MainContext);

  return (
    <div style={{ height: "600px", width: "100%", zIndex: "0" }}>
      <MapContainer
        center={getPosition()}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: "0" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />

        {markerPosition &&
          markerPosition.map((markerr) =>
            markerr.type === "normal" ? (
              <Marker
                position={[markerr.lt, markerr.ln]}
                key={`${markerr.lt}-${markerr.ln}`}
              />
            ) : markerr.type === "busStop" ? (
              <Marker
                icon={customIcon1}
                position={[markerr.lt, markerr.ln]}
                key={`${markerr.lt}-${markerr.ln}`}
              />
            ) : (
              <Marker
                icon={customIcon2}
                position={[markerr.lt, markerr.ln]}
                key={`${markerr.lt}-${markerr.ln}`}
              />
            )
          )}

        {closeSource && (
          <>
            <React.Fragment key={1234}>
              <Polyline positions={closeSource} color="grey" />
            </React.Fragment>
            <Marker icon={customIcon4} position={closeSource[1]} />
          </>
        )}
        {closeDest && (
          <>
            <React.Fragment key={12345}>
              <Polyline positions={closeDest} color="grey" />
            </React.Fragment>
            <Marker icon={customIcon4} position={closeDest[1]} />
          </>
        )}
        {starPoint && <Marker icon={customIcon3} position={starPoint} />}

        {polyLine && (
          <React.Fragment key={123}>
            <Polyline positions={polyLine} color={"#2533a1"} weight={3}>
              <Popup>{"Asdasd"}</Popup>
            </Polyline>
          </React.Fragment>
        )}
      </MapContainer>
    </div>
  );
};

export default BusRouteFinder;
