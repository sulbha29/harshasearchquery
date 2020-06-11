import * as firebase from 'firebase';
require('@firebase/firestore')
window.addEventListener = (x) => x;

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAwzinSRuJJbRPS5L9yfIcvlLu2193qcBk",
    authDomain: "wilyh-960b8.firebaseapp.com",
    databaseURL: "https://wilyh-960b8.firebaseio.com",
    projectId: "wilyh-960b8",
    storageBucket: "wilyh-960b8.appspot.com",
    messagingSenderId: "166774568120",
    appId: "1:166774568120:web:54e2558769c6ba3a74304d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();