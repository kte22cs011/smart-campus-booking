import React from 'react';

export default function VenueCard({ venue, isSelected, onSelect }) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img
            src={venue.imageUrl || 'https://via.placeholder.com/60x60?text=Venue'}
            alt={venue.name}
            className="w-15 h-15 rounded-lg object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {venue.name}
          </h3>
          <p className="text-sm text-gray-500">
            Capacity: {venue.capacity} people
          </p>
          {isSelected && (
            <p className="text-xs text-primary-600 font-medium mt-1">
              Selected
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 