import React from 'react';
import PropertyCard from './PropertyCard';

function PropertyGrid({ properties }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {properties.length > 0 ? (
        properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))
      ) : (
        <p className="text-center w-full">No properties found.</p>
      )}
    </div>
  );
}

export default PropertyGrid;