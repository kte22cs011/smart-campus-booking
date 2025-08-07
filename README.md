# Smart Campus Venue Booking System

A complete, full-stack web application that digitizes and streamlines the venue booking process for colleges. Built with React.js, Tailwind CSS, and Firebase.


Implementation: 

<img width="869" height="774" alt="Screenshot 2025-08-07 142706" src="https://github.com/user-attachments/assets/9a298cbd-22f4-458d-80fd-e04b5d37d47f" />


<img width="790" height="455" alt="Screenshot 2025-08-07 142719" src="https://github.com/user-attachments/assets/26c64aed-1910-41e9-8f6b-a9829699847a" />


<img width="1643" height="870" alt="Screenshot 2025-08-07 143707" src="https://github.com/user-attachments/assets/d9e5c1d0-4c71-409d-9bdb-2a9c54b42968" />



<img width="1065" height="554" alt="Screenshot 2025-08-07 143839" src="https://github.com/user-attachments/assets/69762632-1dec-4244-80fa-25ccdef1eb22" />




<img width="1065" height="554" alt="Screenshot 2025-08-07 143817" src="https://github.com/user-attachments/assets/69762632-1dec-4244-80fa-25ccdef1eb22" />












## Features

### 🔐 User Authentication
- Email/password signup and login
- Three user roles: Student, Faculty, and Admin
- Secure authentication with Firebase Auth

### 🏢 Venue Management
- View all available venues with capacity and images
- Interactive venue selection with visual feedback
- Real-time venue availability calendar

### 📅 Booking System
- Submit booking requests with event details
- Date and time selection with validation
- Real-time booking status updates
- Conflict detection and prevention

### 👨‍💼 Admin Panel
- Approve or reject booking requests
- View all bookings across the system
- Manage venue listings (add/edit/remove)
- Comprehensive booking analytics

### 📱 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean, intuitive interface
- Real-time updates with Firestore
- Mobile-friendly layout

## Technology Stack

- **Frontend**: React.js 18
- **Styling**: Tailwind CSS
- **Backend**: Firebase
- **Authentication**: Firebase Auth
- **Database**: Firestore (NoSQL)
- **Calendar**: React Calendar
- **Routing**: React Router DOM

## Prerequisites

Before running this application, you need:

1. **Node.js** (version 14 or higher)
2. **npm** or **yarn**
3. **Firebase account** and project

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Auditorium-Booking
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication with Email/Password
4. Create a Firestore database
5. Get your Firebase configuration

### 4. Update Firebase Config

Open `src/firebase.js` and replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 5. Set Up Firestore Security Rules

In your Firebase Console, go to Firestore Database > Rules and add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read venues
    match /venues/{venueId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users can read all bookings, but only write their own
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### 6. Initialize Sample Data (Optional)

To add sample venues, you can manually add documents to the `venues` collection in Firestore with this structure:

```javascript
{
  name: "Main Auditorium",
  capacity: 200,
  imageUrl: "https://via.placeholder.com/60x60?text=Auditorium"
}
```

### 7. Run the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage Guide

### For Students/Faculty

1. **Sign Up**: Create an account with your email and select your role
2. **Browse Venues**: View available venues and their capacities
3. **Check Availability**: Click on a venue to see its calendar
4. **Make a Booking**: Click "Book a Venue" and fill out the form
5. **Track Status**: View your booking requests in "My Bookings"

### For Administrators

1. **Access Admin Panel**: Log in with an admin account
2. **Review Requests**: Check pending booking requests
3. **Approve/Reject**: Take action on booking requests
4. **Manage Venues**: Add, edit, or remove venues
5. **View Analytics**: See all bookings across the system

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminPanel.js    # Admin management interface
│   ├── BookingModal.js  # Booking form modal
│   ├── Dashboard.js     # Main dashboard
│   ├── Home.js         # Landing page
│   ├── Login.js        # Login form
│   ├── MyBookings.js   # User's booking history
│   ├── PrivateRoute.js # Route protection
│   ├── Signup.js       # Registration form
│   └── VenueCard.js    # Venue display card
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── firebase.js         # Firebase configuration
├── App.js             # Main app component
├── index.js           # App entry point
└── index.css          # Global styles
```

## Database Schema

### Users Collection
```javascript
{
  name: string,
  email: string,
  role: "student" | "faculty" | "admin"
}
```

### Venues Collection
```javascript
{
  name: string,
  capacity: number,
  imageUrl: string
}
```

### Bookings Collection
```javascript
{
  userId: string,
  userName: string,
  eventName: string,
  venueId: string,
  venueName: string,
  date: string,
  startTime: string,
  endTime: string,
  description: string,
  status: "pending" | "approved" | "rejected",
  createdAt: string
}
```

## Customization

### Adding New Venues
1. Go to the Admin Panel
2. Click "Manage Venues"
3. Click "Add New Venue"
4. Fill in the venue details

### Modifying User Roles
1. Access Firestore directly
2. Navigate to the `users` collection
3. Update the `role` field for the user

### Styling Changes
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Edit component-specific styles in each component

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Build the project:
```bash
npm run build
```

3. Initialize Firebase:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

### Deploy to Other Platforms

The built application can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Verify your Firebase configuration
   - Check if your project is active
   - Ensure Firestore is enabled

2. **Authentication Issues**
   - Verify Email/Password authentication is enabled
   - Check Firestore security rules
   - Ensure user documents are created properly

3. **Calendar Not Loading**
   - Check if react-calendar is installed
   - Verify CSS imports are correct

4. **Real-time Updates Not Working**
   - Check Firestore security rules
   - Verify onSnapshot listeners are properly set up

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: Remember to replace the Firebase configuration with your actual project details before running the application. 
