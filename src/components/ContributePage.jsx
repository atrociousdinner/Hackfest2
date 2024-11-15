import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ContributePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRoute = location.state?.selectedRoute;

  const handleBack = () => {
    // Navigate back with state to indicate we're coming from contribute page
    navigate('/', { 
      state: { 
        fromContribute: true,
        searchParams,
        showResults 
      }
    });
  };
  
  const [formData, setFormData] = useState({
    crowdness: '',
    actualFare: '',
    additionalInfo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Navigate back to main page
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
        <button
            onClick={handleBack}  // Use handleBack instead of direct navigation
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Contribute Information</h1>
          {selectedRoute && (
            <p className="text-gray-600 mt-2">
              Route: {selectedRoute.name || 'Selected Route'}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* Crowdness */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How crowded was the bus?
              </label>
              <select
                name="crowdness"
                value={formData.crowdness}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select crowdness level</option>
                <option value="empty">Empty (0-20%)</option>
                <option value="light">Light (20-40%)</option>
                <option value="moderate">Moderate (40-60%)</option>
                <option value="heavy">Heavy (60-80%)</option>
                <option value="full">Full (80-100%)</option>
              </select>
            </div>

            {/* Actual Fare */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What was the actual fare?
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">NPR</span>
                <input
                  type="number"
                  name="actualFare"
                  value={formData.actualFare}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter actual fare"
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Share any additional information about your journey..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition duration-200"
            >
              Submit Contribution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributePage;