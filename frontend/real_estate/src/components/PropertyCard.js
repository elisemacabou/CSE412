import React, { useState, useEffect } from 'react';

function PropertyCard({ property }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if the property is already a favorite when the component loads
    const userId = 1; // Replace with dynamic user ID if applicable
    fetch(`http://localhost:8000/favorites/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.favorites.some((fav) => fav.id === property.id)) {
          setIsFavorite(true);
        }
      })
      .catch((error) => console.error('Error fetching favorites:', error));
  }, [property.id]);

  const toggleFavorite = async () => {
    const userId = 1; // Replace with dynamic user ID if applicable

    try {
      if (isFavorite) {
        const response = await fetch('http://localhost:8000/favorites/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            property_id: property.id,
          }),
        });

        if (response.ok) {
          setIsFavorite(false);
        } else {
          console.error('Failed to remove from favorites:', response.statusText);
          alert('Failed to remove from favorites. Please try again later.');
        }
      } else {
        const response = await fetch('http://localhost:8000/favorites/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            property_id: property.id,
          }),
        });

        if (response.ok) {
          setIsFavorite(true);
        } else {
          console.error('Failed to add to favorites:', response.statusText);
          alert('Failed to add to favorites. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const formattedPrice = `$${property.price.toLocaleString()}`;

  return (
    <div className="border rounded-lg overflow-hidden shadow-md flex flex-col">
        <img
        src={property.img_src}
        alt={property.address || 'Property Image'} // Use property.address or fallback to 'Property Image'
        className="w-full h-48 object-cover"
        onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400'; // Fallback if the image fails to load
            console.error(`Failed to load image for property ID: ${property.id}`);
        }}
        />
      <div className="p-4 flex justify-between items-center mb-1">
        <h3 className="text-lg font-bold">{formattedPrice}</h3>
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${
            isFavorite ? 'text-red-500' : 'text-gray-500'
          }`}
          onClick={toggleFavorite}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isFavorite ? 'red' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </button>
      </div>
      <div className="p-4 flex flex-col gap-1">
        <p className="text-sm text-gray-600">
          <span className="font-bold">{property.bedrooms}</span> bed,{' '}
          <span className="font-bold">{property.bathrooms}</span> bath,{' '}
          <span className="font-bold">
            {property.living_area ? property.living_area.toLocaleString() : 'N/A'}
          </span>{' '}
          sqft
        </p>
        <p className="text-sm mt-2">{property.address}</p>
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md">
          Email Agent
        </button>
      </div>
    </div>
  );
}

export default PropertyCard;
