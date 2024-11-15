import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SearchResults from './components/SearchResults';
import { busRoutes } from './data/busRoutes';
import BusRouteMap from './components/BusRouteMap';
import { MainContextProvider } from './context/primaryContext';
import ContributePage from './components/ContributePage';

const App = () => {
  const [searchParams, setSearchParams] = useState({ from: '', to: '' });
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (params) => {
    console.log('Search parameters:', params);
    setSearchParams(params);
    setShowResults(true);
  };

  const filteredRoutes = busRoutes.filter(
    (route) =>
      route.from.toLowerCase().includes(searchParams.from.toLowerCase()) &&
      route.to.toLowerCase().includes(searchParams.to.toLowerCase())
  );

  const MainLayout = () => {
    const location = useLocation();

    // Maintain `showResults` state when returning from the contribute page
    React.useEffect(() => {
      if (location.state?.fromContribute) {
        setShowResults(true);
      }
    }, [location]);

    return (
      <div className="relative min-h-screen">
        <div className="flex bg-gray-100 pb-24">
          <Sidebar
            onSearch={handleSearch}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
          <MainContextProvider>
            <BusRouteMap />
          </MainContextProvider>
          <div className="flex-1 p-8">
            {showResults && (
              <SearchResults routes={filteredRoutes} searchParams={searchParams} />
            )}
          </div>
        </div>
        {showResults && <BottomFeatures />}
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route
          path="/contribute"
          element={
            <ContributePage
              searchParams={searchParams}
              showResults={showResults}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
