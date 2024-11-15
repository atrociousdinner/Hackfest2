import React from 'react';

const BottomFeatures = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-6 flex justify-between items-center">
      <div className="flex-1 text-center">
        <h3 className="text-lg font-bold text-gray-800">Crowdness</h3>
      </div>
      <div className="flex-1 text-center">
        <h3 className="text-lg font-bold text-gray-800">Fare</h3>
      </div>
      <div className="flex-1 text-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Contribute
        </button>
      </div>
    </div>
  );
};

export default BottomFeatures;