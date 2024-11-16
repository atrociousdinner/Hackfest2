import { useState } from 'react';
import BusInfoPanel from './BusInfoPanel';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({ from: '', to: '' });
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const navigate = useNavigate();

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
  };
  const handleContributeClick = () => {
    navigate('/contribute', { 
      state: { selectedRoute } // Pass the selectedRoute as state
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchCriteria({ from, to });
    setHasSearched(true);
    setSelectedRoute(null);
  };

  const busRoutes = [
    {
      id: '1',
      from: 'ktm',
      to: 'pkr',
      provider: 'Tourist Bus Seva',
      price: 'NPR 800',
      duration: '7 hours',
      departureTime: '9:00 AM',
      type: 'Tourist Bus',
      facilities: ['AC', 'WiFi', 'Water'],
    },
    {
      id: '2',
      from: 'ktm',
      to: 'pkr',
      provider: 'Deluxe Night Bus',
      price: 'NPR 1200',
      duration: '7 hours',
      departureTime: '5:00 PM',
      type: 'Deluxe',
      facilities: ['AC', 'WiFi', 'Blanket', 'Water'],
    },
    {
      id: '3',
      from: 'ktm',
      to: 'cht',
      provider: 'Local Bus',
      price: 'NPR 300',
      duration: '4 hours',
      departureTime: '8:00 AM',
      type: 'Local',
      facilities: ['Water'],
    },
  ];

  const filteredRoutes = busRoutes.filter(
    (route) =>
      route.from.toLowerCase().includes(searchCriteria.from.toLowerCase()) &&
      route.to.toLowerCase().includes(searchCriteria.to.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
  {/* Sidebar and BusInfoPanel Container */}
  <div className="flex flex-col w-96 bg-white shadow-lg p-6">
    {/* Sidebar Section */}
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Nepal Travel Guide</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From:</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter departure city"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To:</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter destination city"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
        >
          Search Routes
        </button>
      
      </form>
      <button
          className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
          onClick={handleContributeClick}
          >
          Contribute Information
        </button>

      {/* Route Cards */}
      <div className="mt-8 space-y-6">
        {hasSearched && (
          <>
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className={`bg-white border rounded-lg shadow-md p-4 transition duration-200 ${
                    selectedRoute?.id === route.id
                      ? 'ring-2 ring-blue-500'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleRouteClick(route)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {route.provider}
                    </h3>
                    <span className="text-xl font-bold text-green-600">
                      {route.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{route.type}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Departure Time</p>
                      <p className="font-medium text-sm">{route.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium text-sm">{route.duration}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500">Facilities</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {route.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 mt-4">
                No routes found for the selected criteria.
              </div>
            )}
          </>
        )}
      </div>
    </div>

    {/* BusInfoPanel Section */}
    <div className="mt-6">
      <BusInfoPanel selectedRoute={selectedRoute} />
    </div>
  </div>


</div>

  );
};

export default Sidebar;