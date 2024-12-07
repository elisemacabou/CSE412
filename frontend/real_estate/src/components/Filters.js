import React, { useState, useEffect } from 'react';

function Filters({ onFilterChange, onSortChange, onFavoritesChange, showFavorites, cities = [] }) {
  const [showPriceSlider, setShowPriceSlider] = useState(false);
  const [showSquareFeetSlider, setShowSquareFeetSlider] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2500000 });
  const [squareFeet, setSquareFeet] = useState({ min: 0, max: 3000 });
  const [bedrooms, setBedrooms] = useState('Any');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSortChange = (e) => {
    onSortChange(e.target.value); // Pass the selected sort option to the parent
  };

  useEffect(() => {
    console.log('Received cities in Filters:', cities);
  }, [cities]);

  const handleApplyFilters = () => {
    const filters = {
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      squareFeetMin: squareFeet.min,
      squareFeetMax: squareFeet.max,
      bedrooms: bedrooms === 'Any' ? null : parseInt(bedrooms, 10),
      city: selectedCity || null,
    };

    onFilterChange(filters);
  };

  return (
    <div className="bg-gray-100 p-4 flex flex-wrap items-center justify-between">
      <div className="flex items-center space-x-4 flex-grow">

       {/* City Dropdown */}
       <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">City</label>
        <select
          className="border rounded px-4 py-2 bg-white"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

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
          <label className="text-gray-700 font-medium mb-1">Price Range</label>
          <button
            className="border rounded px-4 py-2 bg-white text-gray-700"
            onClick={() => setShowPriceSlider(!showPriceSlider)}
          >
            ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
          </button>
          {showPriceSlider && (
            <div className="mt-2 flex flex-col space-y-2">
              <div>
                <label className="block text-sm text-gray-600">Min Price</label>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))
                  }
                  className="w-full"
                />
                <span>${priceRange.min.toLocaleString()}</span>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Max Price</label>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                  }
                  className="w-full"
                />
                <span>${priceRange.max.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Square Feet Filter */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Square Feet Range</label>
          <button
            className="border rounded px-4 py-2 bg-white text-gray-700"
            onClick={() => setShowSquareFeetSlider(!showSquareFeetSlider)}
          >
            {squareFeet.min.toLocaleString()} - {squareFeet.max.toLocaleString()} sqft
          </button>
          {showSquareFeetSlider && (
            <div className="mt-2 flex flex-col space-y-2">
              <div>
                <label className="block text-sm text-gray-600">Min Square Feet</label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="100"
                  value={squareFeet.min}
                  onChange={(e) =>
                    setSquareFeet((prev) => ({ ...prev, min: Number(e.target.value) }))
                  }
                  className="w-full"
                />
                <span>{squareFeet.min.toLocaleString()} sqft</span>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Max Square Feet</label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="100"
                  value={squareFeet.max}
                  onChange={(e) =>
                    setSquareFeet((prev) => ({ ...prev, max: Number(e.target.value) }))
                  }
                  className="w-full"
                />
                <span>{squareFeet.max.toLocaleString()} sqft</span>
              </div>
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
      <span className="text-gray-100 text-sm mb-1">Fav</span>
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
