// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB--4e0yKbRUHtVb4T91CQd8Ya31Ru3SRA",
  authDomain: "magicwheel-1894c.firebaseapp.com",
  projectId: "magicwheel-1894c",
  storageBucket: "magicwheel-1894c.appspot.com",
  messagingSenderId: "728080613218",
  appId: "1:728080613218:web:80b443d3d509ae0615b63b",
  measurementId: "G-P9PLQJ5TRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getStorage(app);
export  { db }; 