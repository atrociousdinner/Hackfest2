// MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { busRoutes } from '../data/busRoutes';
import SearchResults from '../components/SearchResults';
import BusRouteMap from '../components/BusRouteMap';
import { MainContextProvider } from '../context/primaryContext';
import BusInfoPanel from './BusInfoPanel';

const MainLayout = () => {
  const [searchParams, setSearchParams] = useState({ from: '', to: '' });
  const [showResults, setShowResults] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleSearch = (params) => {
    setSearchParams(params);
    setShowResults(true);
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const filteredRoutes = busRoutes.filter(
    (route) =>
      route.from.toLowerCase().includes(searchParams.from.toLowerCase()) &&
      route.to.toLowerCase().includes(searchParams.to.toLowerCase())
  );

  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromContribute) {
      setShowResults(true);
    }
  }, [location]);

  return (
    <div className="relative flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex-none w-80 bg-white shadow-lg overflow-y-auto h-screen">
        <Sidebar
          onSearch={handleSearch}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          handleRouteSelect={handleRouteSelect}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <MainContextProvider>
          <div className="flex-1 ">
            <BusRouteMap />
          </div>
        </MainContextProvider>

        {showResults && (
          <div className="absolute top-0 right-0 w-80 bg-gray-50 h-screen shadow-lg overflow-y-auto">
            <SearchResults
              routes={filteredRoutes}
              searchParams={searchParams}
              onRouteSelect={handleRouteSelect}
            />
          </div>
        )}
      </div>

      {/* Bus Info Panel */}
      {selectedRoute && (
        <div className="absolute left-64 top-0 w-80 bg-white shadow-lg border-l border-gray-200 h-screen overflow-y-auto">
          <BusInfoPanel selectedRoute={selectedRoute} />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
