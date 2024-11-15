import React from 'react';

const BusInfoPanel = ({ selectedRoute }) => {
  if (!selectedRoute) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center gap-8">
          {/* Crowdness Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Crowdness</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 bg-gray-200 rounded-full flex-1">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: '30%' }}
                />
              </div>
              <span className="text-sm text-gray-600">30% Full</span>
            </div>
          </div>

          {/* Fare Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Fare</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Fare:</span>
                <span className="font-medium">{selectedRoute.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Charge:</span>
                <span className="font-medium">NPR 50</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{`NPR ${parseInt(selectedRoute.price.split(' ')[1]) + 50}`}</span>
              </div>
            </div>
          </div>

          {/* Contribute Button */}
          <div className="flex-1 flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
              onClick={() => {/* Handle contribute click */}}
            >
              Contribute Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusInfoPanel;