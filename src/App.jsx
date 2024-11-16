import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [selectedBus, setSelectedBus] = useState(null);

  // Dummy bus data
  const busRoutes = [
    {
      id: 1,
      name: "Tourist Bus Seva",
      price: 800,
      departure: "9:00 AM",
      duration: "7 hours",
      facilities: ["AC", "WiFi", "Water"],
      serviceCharge: 50,
      crowdedness: 30,
    },
    {
      id: 2,
      name: "Deluxe Night Bus",
      price: 1200,
      departure: "10:00 PM",
      duration: "6 hours",
      facilities: ["AC", "WiFi", "Snacks"],
      serviceCharge: 70,
      crowdedness: 50,
    },
  ];

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 p-4 flex flex-col border-r border-gray-300">
        <h1 className="text-xl font-bold text-blue-600 mb-6">Nepal Travel Guide</h1>
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From:</label>
            <input
              type="text"
              placeholder="Kathmandu"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To:</label>
            <input
              type="text"
              placeholder="Pokhara"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Search Routes
          </button>
        </div>

        {/* Routes Section */}
        <div className="mt-6 space-y-4">
          {busRoutes.map((bus) => (
            <div
              key={bus.id}
              className={`p-4 bg-white shadow rounded-md cursor-pointer ${
                selectedBus?.id === bus.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedBus(bus)}
            >
              <h2 className="text-lg font-bold">{bus.name}</h2>
              <p className="text-sm text-gray-600">NPR {bus.price}</p>
              <p className="text-sm">Departure Time: {bus.departure}</p>
              <p className="text-sm">Duration: {bus.duration}</p>
              <div className="mt-2 flex space-x-2">
                {bus.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Map */}
        <div className="flex-grow">
          <MapContainer
            center={[27.7172, 85.324]}
            zoom={10}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          </MapContainer>
        </div>

        {/* Bottom Panel (Conditional Rendering) */}
        {selectedBus && (
          <div className="w-full p-4 bg-gray-50 border-t border-gray-300 flex justify-between items-center">
            {/* Crowdedness */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Crowdedness:</label>
              <div className="relative w-40 bg-gray-200 rounded-full h-4">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                  style={{ width: `${selectedBus.crowdedness}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {selectedBus.crowdedness}% Full
              </span>
            </div>

            {/* Fare */}
            <div className="text-right">
              <p className="text-sm">
                Base Fare: <span className="font-medium">NPR {selectedBus.price}</span>
              </p>
              <p className="text-sm">
                Service Charge:{" "}
                <span className="font-medium">NPR {selectedBus.serviceCharge}</span>
              </p>
              <p className="text-lg font-bold">
                Total: NPR {selectedBus.price + selectedBus.serviceCharge}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
