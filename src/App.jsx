import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import SearchResults from './components/SearchResults';
import { busRoutes } from './data/busRoutes';
import BottomFeatures from './components/BottomFeatures';

const App = () => {
  const [searchParams, setSearchParams] = useState({ from: '', to: '' });
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (params) => {
    console.log("Search parameters:", params); // Check search trigger
    setSearchParams(params);
    setShowResults(true);
  };

  const filteredRoutes = busRoutes.filter(
    route => 
      route.from.toLowerCase().includes(searchParams.from.toLowerCase()) &&
      route.to.toLowerCase().includes(searchParams.to.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      <div className="flex bg-gray-100 pb-24"> {/* Added pb-24 for bottom spacing */}
        <Sidebar
          onSearch={handleSearch}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <div className="flex-1 p-8">
          {showResults && (
            <SearchResults 
              routes={filteredRoutes} 
              searchParams={searchParams}
            />
          )}
        </div>
      </div>
      {showResults && <BottomFeatures />}
    </div>
  );
};

export default App;