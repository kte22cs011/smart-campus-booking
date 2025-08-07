import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Calendar from 'react-calendar';
import BookingModal from './BookingModal';
import VenueCard from './VenueCard';
import MyBookings from './MyBookings';
import AdminPanel from './AdminPanel';
import 'react-calendar/dist/Calendar.css';

export default function Dashboard() {
  const { currentUser, userRole, logout } = useAuth();
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch venues from Firestore
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venuesCollection = collection(db, 'venues');
        const venuesSnapshot = await getDocs(venuesCollection);
        const venuesList = venuesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVenues(venuesList);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  // Fetch bookings for the selected venue
  useEffect(() => {
    if (!selectedVenue) {
      setBookings([]);
      return;
    }

    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('venueId', '==', selectedVenue.id),
      where('status', '==', 'approved')
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
  }, [selectedVenue]);

  // Handle venue selection
  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Check if a date is booked
  const isDateBooked = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.some(booking => booking.date === dateString);
  };

  // Tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view === 'month' && isDateBooked(date)) {
      return (
        <div className="w-full h-full bg-red-200 rounded-sm flex items-center justify-center">
          <span className="text-xs text-red-800">Booked</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Campus Bookings</h1>
              <p className="text-gray-600">Book college venues, hassle-free</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {currentUser?.email} ({userRole})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Panel */}
        {userRole === 'admin' && (
          <div className="mb-8">
            <AdminPanel />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Venues Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Venues</h2>
              <div className="space-y-4">
                {venues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    isSelected={selectedVenue?.id === venue.id}
                    onSelect={() => handleVenueSelect(venue)}
                  />
                ))}
              </div>
            </div>

            {/* Book a Venue Button */}
            <div className="mt-6">
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
              >
                Book a Venue
              </button>
            </div>

            {/* My Bookings Section */}
            <div className="mt-8">
              <MyBookings />
            </div>
          </div>

          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {selectedVenue ? `${selectedVenue.name} - Availability` : 'Select a venue to view availability'}
              </h2>
              
              {selectedVenue ? (
                <div>
                  <Calendar
                    tileContent={tileContent}
                    className="w-full"
                    minDate={new Date()}
                  />
                  <div className="mt-4 text-sm text-gray-600">
                    <p>• Red dates indicate booked slots</p>
                    <p>• Click "Book a Venue" to make a reservation</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Please select a venue from the list to view its availability calendar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          venues={venues}
          onClose={() => setShowBookingModal(false)}
          onBookingComplete={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
} 