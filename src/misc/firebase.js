import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
   apiKey: 'AIzaSyA-DHAg2OVbPC5zz8NeR_YvRxobve8G4o0',
   authDomain: 'chat-web-app-8e7c7.firebaseapp.com',
   databaseURL:
      'https://chat-web-app-8e7c7-default-rtdb.europe-west1.firebasedatabase.app/',
   projectId: 'chat-web-app-8e7c7',
   storageBucket: 'chat-web-app-8e7c7.appspot.com',
   messagingSenderId: '342792034778',
   appId: '1:342792034778:web:d6ff153631ebfbd10708e3',
   measurementId: 'G-FBDD192DS6',
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// firebase.analytics();
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
