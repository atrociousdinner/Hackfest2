import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import busRoutes from '../assets/data/busRoutes';


const BusInfoPanel = ({ selectedRoute }) => {
  const navigate = useNavigate(); // Add this hook
  console.log(selectedRoute)
  if (!selectedRoute) return null;

  return (
    <div className="fixed bottom-0 z-10 left-[321px] right-0 bg-white shadow-lg border-t border-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center gap-8">
          {/* Crowdness Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Crowdness</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 bg-gray-200 rounded-full flex-1">
              <div 
                className={`h-full rounded-full ${
                  selectedRoute.crowdness === "Low" 
                    ? "bg-green-500" 
                    : selectedRoute.crowdness === "Medium" 
                    ? "bg-yellow-500" 
                    : "bg-red-500"
                }`} 
                style={{ width: selectedRoute.crowdness === "Low" ? '30%' : selectedRoute.crowdness === "Medium" ? '60%' : '100%' }}
              />
              </div>
              <span className="text-sm text-gray-600">{selectedRoute.crowdness}</span>
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
        </div>
      </div>
    </div>
  );
};

export default BusInfoPanel;