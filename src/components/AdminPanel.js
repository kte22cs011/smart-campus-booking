import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminPanel() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [activeTab, setActiveTab] = useState('requests');
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [newVenue, setNewVenue] = useState({ name: '', capacity: '', imageUrl: '' });

  // Fetch all bookings
  useEffect(() => {
    const bookingsQuery = query(collection(db, 'bookings'));
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllBookings(bookingsList);
      setPendingBookings(bookingsList.filter(booking => booking.status === 'pending'));
    });

    return () => unsubscribe();
  }, []);

  // Fetch venues
  useEffect(() => {
    const venuesQuery = query(collection(db, 'venues'));
    const unsubscribe = onSnapshot(venuesQuery, (snapshot) => {
      const venuesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVenues(venuesList);
    });

    return () => unsubscribe();
  }, []);

  const handleBookingAction = async (bookingId, action) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: action,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleAddVenue = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'venues'), {
        name: newVenue.name,
        capacity: parseInt(newVenue.capacity),
        imageUrl: newVenue.imageUrl || 'https://via.placeholder.com/60x60?text=Venue'
      });
      setNewVenue({ name: '', capacity: '', imageUrl: '' });
      setShowAddVenue(false);
    } catch (error) {
      console.error('Error adding venue:', error);
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await deleteDoc(doc(db, 'venues', venueId));
      } catch (error) {
        console.error('Error deleting venue:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Booking Requests ({pendingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Bookings ({allBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('venues')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'venues'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Venues ({venues.length})
          </button>
        </nav>
      </div>

      <div className="p-6">
        {/* Booking Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Booking Requests</h3>
            {pendingBookings.length === 0 ? (
              <p className="text-gray-500">No pending booking requests.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.eventName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.venueName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(booking.date)}<br />
                          {booking.startTime} - {booking.endTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleBookingAction(booking.id, 'approved')}
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleBookingAction(booking.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-xs"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* All Bookings Tab */}
        {activeTab === 'all' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">All Bookings</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.eventName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.venueName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(booking.date)}<br />
                        {booking.startTime} - {booking.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'pending' ? 'booking-pending' :
                          booking.status === 'approved' ? 'booking-approved' :
                          'booking-rejected'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Venues Tab */}
        {activeTab === 'venues' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Venues</h3>
              <button
                onClick={() => setShowAddVenue(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add New Venue
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venues.map((venue) => (
                <div key={venue.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={venue.imageUrl}
                        alt={venue.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{venue.name}</h4>
                        <p className="text-sm text-gray-500">Capacity: {venue.capacity}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteVenue(venue.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Venue Modal */}
            {showAddVenue && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Venue</h3>
                    <form onSubmit={handleAddVenue} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venue Name
                        </label>
                        <input
                          type="text"
                          value={newVenue.name}
                          onChange={(e) => setNewVenue({...newVenue, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Capacity
                        </label>
                        <input
                          type="number"
                          value={newVenue.capacity}
                          onChange={(e) => setNewVenue({...newVenue, capacity: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL (optional)
                        </label>
                        <input
                          type="url"
                          value={newVenue.imageUrl}
                          onChange={(e) => setNewVenue({...newVenue, imageUrl: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddVenue(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                        >
                          Add Venue
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 