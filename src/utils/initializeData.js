import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';

// Sample venues data
const sampleVenues = [
  {
    name: "Main Auditorium",
    capacity: 200,
    imageUrl: "https://via.placeholder.com/60x60?text=Auditorium"
  },
  {
    name: "Seminar Hall A",
    capacity: 50,
    imageUrl: "https://via.placeholder.com/60x60?text=Seminar"
  },
  {
    name: "Computer Lab 3",
    capacity: 30,
    imageUrl: "https://via.placeholder.com/60x60?text=Lab"
  },
  {
    name: "Conference Room",
    capacity: 25,
    imageUrl: "https://via.placeholder.com/60x60?text=Conference"
  },
  {
    name: "Sports Complex",
    capacity: 100,
    imageUrl: "https://via.placeholder.com/60x60?text=Sports"
  }
];

// Initialize sample venues
export const initializeVenues = async () => {
  try {
    console.log('Initializing sample venues...');
    
    for (const venue of sampleVenues) {
      await addDoc(collection(db, 'venues'), venue);
      console.log(`Added venue: ${venue.name}`);
    }
    
    console.log('Sample venues initialized successfully!');
  } catch (error) {
    console.error('Error initializing venues:', error);
  }
};

// Create admin user
export const createAdminUser = async (email, password, name) => {
  try {
    console.log('Creating admin user...');
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore with admin role
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      role: 'admin'
    });
    
    console.log('Admin user created successfully!');
    return user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Initialize all sample data
export const initializeAllData = async () => {
  try {
    await initializeVenues();
    console.log('All sample data initialized successfully!');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

// Usage instructions
console.log(`
To initialize sample data, you can:

1. Call initializeVenues() to add sample venues
2. Call createAdminUser(email, password, name) to create an admin user
3. Call initializeAllData() to initialize everything

Example:
import { initializeAllData, createAdminUser } from './utils/initializeData';

// Initialize venues
await initializeAllData();

// Create admin user (run this in browser console after Firebase is configured)
await createAdminUser('admin@college.edu', 'admin123', 'Admin User');
`); 