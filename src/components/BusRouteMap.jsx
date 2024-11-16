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
import { MapPin, Bus, Flag, Undo2 } from "lucide-react";

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

const BusRouteMap = () => {
  // const [markerPosition, setMarkerPosition] = useState([]);
  const {
    markerState,
    setMarkerState,
    busStops,
    setBusStops,
    majorCheckPoints,
    setMajorCheckPoints,
    polyLine,
    setPolyLine,
    markerPosition,
    setMarkerPosition,
    sendDataToServer,
    
  } = useContext(MainContext);

  // const [busStops, setBusStops] = useState([]);
  // const [majorCheckPoints, setMajorCheckPoints] = useState([]);

  // const [polyLine, setPolyLine] = useState([]);

  console.log(markerState);

  const customIcon1 = createCustomIcon1();
  const customIcon2 = createCustomIcon2();

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
      const round_lat = Math.round(lat * 1000) / 1000;
      const round_lng = Math.round(lon * 1000) / 1000;
      setMarkerPosition((prev) => [
        ...prev,
        { type: markerState, lt: round_lat, ln: round_lng, namee: placeName },
      ]);
      // setMajorCheckPoints((prev) => [
      //   ...prev,
      //   { lt: lat, ln: lon, namee: placeName },
      // ]);

      checkAndAddCheckPoint({ lt: round_lat, ln: round_lng, namee: placeName });
      console.log(placeName, lat, lon);
      console.log(majorCheckPoints);
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Error fetching location");
    }
  };

  const checkAndAddCheckPoint = async (newCheckPoint) => {
    try {
      // Check if the checkpoint already exists in the database
      const response = await fetch("http://localhost:3000/checkcheckpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCheckPoint),
      });

      const result = await response.json();

      if (!result.exists) {
        // Add the new checkpoint to the database if it doesn't exist
        const addResponse = await fetch("http://localhost:3000/addcheckpoint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCheckPoint),
        });

        if (!addResponse.ok) {
          throw new Error("Failed to add checkpoint to the database");
        }

        console.log("Checkpoint added successfully:", newCheckPoint);

        // Update the local state only if the addition is successful
        setMajorCheckPoints((prev) => [...prev, newCheckPoint]);
      } else {
        console.log(
          "Checkpoint already exists in the database:",
          newCheckPoint
        );
      }
    } catch (error) {
      console.error("Error checking/adding checkpoint:", error);
    }
  };

  const checkAndAddBusStop = async (newStop) => {
    try {
      // Check if the bus stop already exists in the database
      const response = await fetch("http://localhost:3000/checkbusstop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStop),
      });

      const result = await response.json();

      if (!result.exists) {
        // Add the new bus stop to the database if it doesn't exist
        const addResponse = await fetch("http://localhost:3000/addbusstop", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStop),
        });

        if (!addResponse.ok) {
          throw new Error("Failed to add bus stop to the database");
        }

        console.log("Bus stop added successfully:", newStop);

        // Update the local state only if the addition is successful
        setBusStops((prev) => [...prev, newStop]);
      } else {
        console.log("Bus stop already exists in the database:", newStop);
      }
    } catch (error) {
      console.error("Error checking/adding bus stop:", error);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;

        setPolyLine((prev) => [...prev, [lat, lng]]);

        if (markerState === "majorCheckPoint") {
          fetchLocationName(lat, lng);
        } else if (markerState === "normal") {
          setMarkerPosition((prev) => [
            ...prev,
            { type: markerState, lt: lat, ln: lng },
          ]);
        }

        if (markerState === "busStop") {
          const round_lat = Math.round(lat * 1000) / 1000;
          const round_lng = Math.round(lng * 1000) / 1000;

          const newStop = { lt: round_lat, ln: round_lng };

          setMarkerPosition((prev) => [
            ...prev,
            { type: markerState, lt: round_lat, ln: round_lng },
          ]);

          // Check and add the bus stop to the database and state
          checkAndAddBusStop(newStop);

          // setBusStops((prev) => {
          //   const newStop = { lt: round_lat, ln: round_lng };
          //   const uniqueStops = new Set(prev.map((stop) => JSON.stringify(stop)));
          //   uniqueStops.add(JSON.stringify(newStop));
          //   return Array.from(uniqueStops).map((stop) => JSON.parse(stop));
          // });
        }

        console.log(markerPosition);
        console.log(busStops);
      },
    });
    return null;
  };

  const undoMark = async () => {
    try {
      if (markerState === "busStop" && markerPosition.length > 0) {
        // Get the last bus stop added
        const lastMarker = markerPosition[markerPosition.length - 1];

        // Check if it is a bus stop
        if (lastMarker.type === "busStop") {
          // Make API call to delete the bus stop from the database
          const response = await fetch("http://localhost:3000/deletebus", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lt: Math.round(lastMarker.lt * 1000) / 1000,
              ln: Math.round(lastMarker.ln * 1000) / 1000,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to delete the bus stop from the database");
          }

          console.log("Bus stop deleted successfully:", lastMarker);
        }
      }

      // Remove the last marker from markerPosition
      markerPosition.pop();
      polyLine.pop();

      console.log("Updated marker positions:", markerPosition);
    } catch (error) {
      console.error("Error undoing marker:", error);
    }
  };

  return (
    <div style={{ height: "85vh", width: "100%" }}>
      <div className="flex gap-2 p-2">
        <button
          onClick={() => setMarkerState("normal")}
          className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md hover:bg-gray-50 shadow-sm"
        >
          <MapPin className="w-4 h-4" />
          <span>Normal</span>
        </button>

        <button
          onClick={() => setMarkerState("busStop")}
          className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md hover:bg-gray-50 shadow-sm"
        >
          <Bus className="w-4 h-4" />
          <span>Bus Stop</span>
        </button>

        <button
          onClick={() => setMarkerState("majorCheckPoint")}
          className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md hover:bg-gray-50 shadow-sm"
        >
          <Flag className="w-4 h-4" />
          <span>Major Checkpoint</span>
        </button>

        <button
          onClick={undoMark}
          className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md hover:bg-gray-50 shadow-sm"
        >
          <Undo2 className="w-4 h-4" />
          <span>Undo</span>
        </button>
      </div>

      <MapContainer
        center={getPosition()}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
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

        {polyLine && (
          <React.Fragment key={123}>
            <Polyline positions={polyLine} color={"green"} weight={3}>
              <Popup>{"Asdasd"}</Popup>
            </Polyline>
          </React.Fragment>
        )}
      </MapContainer>
    </div>
  );
};

export default BusRouteMap;
