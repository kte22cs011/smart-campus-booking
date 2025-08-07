import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function MyBookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'booking-pending',
      approved: 'booking-approved',
      rejected: 'booking-rejected'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Bookings</h2>
        <div className="text-center py-4">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found.</p>
          <p className="text-sm text-gray-400 mt-1">Your booking requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{booking.eventName}</h3>
                {getStatusBadge(booking.status)}
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Venue:</span> {booking.venueName}</p>
                <p><span className="font-medium">Date:</span> {formatDate(booking.date)}</p>
                <p><span className="font-medium">Time:</span> {booking.startTime} - {booking.endTime}</p>
                {booking.description && (
                  <p><span className="font-medium">Description:</span> {booking.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 