import React, { useState } from 'react';

function Filters({ onFilterChange, onSortChange, onFavoritesChange, showFavorites }) {
  const [showPriceSlider, setShowPriceSlider] = useState(false);
  const [showSquareFeetSlider, setShowSquareFeetSlider] = useState(false);
  const [priceRange, setPriceRange] = useState(2500000); // Default value for price
  const [squareFeet, setSquareFeet] = useState(3000); // Default value for square feet
  const [bedrooms, setBedrooms] = useState('Any'); // Default value for bedrooms

  const handleSortChange = (e) => {
    onSortChange(e.target.value); // Pass the selected sort option to the parent
  };

  const handleApplyFilters = () => {
    // Create the filters object
    const filters = {
      price: priceRange,
      squareFeet,
      bedrooms: bedrooms === 'Any' ? null : parseInt(bedrooms, 10),
    };

    console.log('Applying filters:', filters); // Debugging the filters before sending

    // Trigger the parent's filter change handler
    onFilterChange(filters);
  };

  return (
    <div className="bg-gray-100 p-4 flex flex-wrap items-center justify-between">
      <div className="flex items-center space-x-4 flex-grow">
        {/* Bedrooms Dropdown */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Bedrooms</label>
          <select
            className="border rounded px-4 py-2 bg-white"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          >
            <option value="Any">Any</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4">4+ Beds</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Price</label>
          <button
            className="border rounded px-4 py-2 bg-white text-gray-700"
            onClick={() => setShowPriceSlider(!showPriceSlider)}
          >
            0 - ${priceRange.toLocaleString()}
          </button>
          {showPriceSlider && (
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="10000000"
                step="100000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-48"
              />
              <span className="block mt-1">0 - ${priceRange.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Square Feet Filter */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Square Feet</label>
          <button
            className="border rounded px-4 py-2 bg-white text-gray-700"
            onClick={() => setShowSquareFeetSlider(!showSquareFeetSlider)}
          >
            0 - {squareFeet.toLocaleString()} sqft
          </button>
          {showSquareFeetSlider && (
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={squareFeet}
                onChange={(e) => setSquareFeet(Number(e.target.value))}
                className="w-48"
              />
              <span className="block mt-1">0 - {squareFeet.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        {/* Sort Dropdown and Apply Filters */}
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Sort by</label>
            <select
              className="border rounded px-4 py-2 bg-white"
              onChange={handleSortChange}
            >
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
            </select>
          </div>

          <div className="flex flex-col items-center">
            {/* Add the Filters label */}
            <span className="text-gray-100 text-sm mb-1">Filters</span>
            <button
              className="bg-gray-200 text-blue-600 px-4 py-2 rounded border border-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Button */}
      <div>
        <button
          className={`flex items-center border rounded px-4 py-2 transition-colors duration-300 ${
            showFavorites ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={onFavoritesChange}
        >
          <span className="mr-2">❤️</span> Favorites
        </button>
      </div>
    </div>
  );
}

export default Filters;