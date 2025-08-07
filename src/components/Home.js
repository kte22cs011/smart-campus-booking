import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Campus Bookings
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Book college venues, hassle-free
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Streamline your venue booking process with our intuitive platform. 
              No more scheduling conflicts or manual paperwork. 
              Get instant visibility into venue availability and manage bookings efficiently.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Availability</h3>
                <p className="text-gray-600">See venue availability instantly with our interactive calendar</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Booking</h3>
                <p className="text-gray-600">Submit booking requests with just a few clicks</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Approval</h3>
                <p className="text-gray-600">Get fast approval from administrators</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 md:py-4 md:text-lg md:px-10 transition duration-200"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Smart Campus Bookings. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 