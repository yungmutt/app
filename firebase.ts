import firebase from "firebase/compat";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage} from 'firebase/storage';
import {FIREBASE_API_KEY} from "@env";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: `${FIREBASE_API_KEY}`,
    authDomain: "application-83a87.firebaseapp.com",
    projectId: "application-83a87",
    storageBucket: "application-83a87.appspot.com",
    messagingSenderId: "1024689340194",
    appId: "1:1024689340194:web:f06b5780123813a861ef7b"
};
//checks if the app has already been initialized
if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export const storage = getStorage();

export {firebase};