import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: "AIzaSyC84dPpqnD1dqodaVufu15icvJTWnnpBSg",
  authDomain: "sistema-51181.firebaseapp.com",
  projectId: "sistema-51181",
  storageBucket: "sistema-51181.appspot.com",
  messagingSenderId: "497168129190",
  appId: "1:497168129190:web:1958627bccf010ba492867",
  measurementId: "G-XFL28SJXCX"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;