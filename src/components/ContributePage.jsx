import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, User } from 'lucide-react';

const ContributePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const selectedRoute = location.state?.selectedRoute;

  const [formData, setFormData] = useState({
    busName: '',
    type: '',
    ticketCost: '',
    crowdness: '',
    startPoint: '',
    endPoint: ''
  });

  const handleBack = () => {
    navigate('/', { 
      state: { 
        fromContribute: true,
        searchParams: location.state?.searchParams,
        showResults: location.state?.showResults 
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const busTypes = ['Local', 'Tourist', 'Deluxe', 'Semi-Deluxe'];

  const CrowdIndicator = ({ level, selected, onClick, count }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200 ${
        selected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-center h-12 mb-2">
        {[...Array(count)].map((_, index) => (
          <div
            key={index}
            className={`relative ${
              index > 0 ? '-ml-3' : ''
            }`}
          >
            <User
              className={`w-6 h-6 ${
                selected ? 'text-blue-600' : 'text-gray-600'
              }`}
              strokeWidth={2}
            />
          </div>
        ))}
      </div>
      <span className={`text-sm font-medium ${
        selected ? 'text-blue-600' : 'text-gray-600'
      }`}>
        {level}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Share Your Experience</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Bus Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus Name
            </label>
            <input
              type="text"
              name="busName"
              value={formData.busName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Bus Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select bus type</option>
              {busTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Ticket Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Cost
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">NPR</span>
              <input
                type="number"
                name="ticketCost"
                value={formData.ticketCost}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter ticket cost"
                required
              />
            </div>
          </div>

          {/* Crowdness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crowdness
            </label>
            <div className="flex space-x-4">
              <CrowdIndicator
                level="Low"
                selected={formData.crowdness === 'low'}
                onClick={() => setFormData(prev => ({ ...prev, crowdness: 'low' }))}
                count={1}
              />
              <CrowdIndicator
                level="Medium" 
                selected={formData.crowdness === 'medium'}
                onClick={() => setFormData(prev => ({ ...prev, crowdness: 'medium' }))}
                count={2}
              />
              <CrowdIndicator
                level="High"
                selected={formData.crowdness === 'high'}
                onClick={() => setFormData(prev => ({ ...prev, crowdness: 'high' }))}
                count={3}
              />
            </div>
          </div>

          {/* Bus Route */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus Route
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="startPoint"
                value={formData.startPoint}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2"
                placeholder="Start"
                required
              />
              <input
                type="text"
                name="endPoint"
                value={formData.endPoint}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2"
                placeholder="End"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition duration-200"
          >
            Submit Experience
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContributePage;