import firebase from "firebase/compat";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage} from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFcBOUhVWTmHvXvmdTu0CCyWP_avADcG4",
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