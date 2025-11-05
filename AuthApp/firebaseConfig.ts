// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDc6-WMzYphs07eSa1Mng5EB9E5aAl23Ok",
  authDomain: "862426445013-04u4i6p0ch8mcc6o1gvfj6efjg5itohm.apps.googleusercontent.com.firebaseapp.com",
  projectId: "862426445013-04u4i6p0ch8mcc6o1gvfj6efjg5itohm.apps.googleusercontent.com",
  storageBucket: "862426445013-04u4i6p0ch8mcc6o1gvfj6efjg5itohm.apps.googleusercontent.com.appspot.com",
  messagingSenderId: "862426445013",
  appId: "1:862426445013:web:c3374e04f51799a5f0de5c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
