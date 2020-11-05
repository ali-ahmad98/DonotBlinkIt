import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8s03oOrlrhgq4VzOOsECe6iRye2JchBs",
    authDomain: "do-not-blink-be7eb.firebaseapp.com",
    databaseURL: "https://do-not-blink-be7eb.firebaseio.com",
    projectId: "do-not-blink-be7eb",
    storageBucket: "do-not-blink-be7eb.appspot.com",
    messagingSenderId: "760548925469",
    appId: "1:760548925469:web:f8a5210917f2cec53826f4",
    measurementId: "G-YDZQC6DTXW"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase; 