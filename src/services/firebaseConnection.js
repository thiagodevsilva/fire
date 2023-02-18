import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyB57_QQJMMaSprPimPH0-pfqd5AjlhI2hs",
    authDomain: "fire-f50e0.firebaseapp.com",
    projectId: "fire-f50e0",
    storageBucket: "fire-f50e0.appspot.com",
    messagingSenderId: "878378416957",
    appId: "1:878378416957:web:568ffc41751973a028a354"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;