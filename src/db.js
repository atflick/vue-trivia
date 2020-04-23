import firebase from 'firebase/app'
import 'firebase/firestore'

export const db = firebase.initializeApp({
  apiKey: process.env.FIREBASE_KEY,
  authDomain: 'vue-trivia-94d5e.firebaseapp.com',
  databaseURL: 'https://vue-trivia-94d5e.firebaseio.com',
  projectId: 'vue-trivia-94d5e',
  storageBucket: 'vue-trivia-94d5e.appspot.com',
  messagingSenderId: '205718714727',
  appId: '1:205718714727:web:dbe58f559e21f08eb457c2',
  measurementId: 'G-QXBT67WP2E'
}).firestore()

export const gamesCollection = db.collection('games')
export const teamsCollection = db.collection('teams')
export const { FieldValue, DocumentReference } = firebase.firestore

// export const addTeam = (gameRef, teamId) => {
//   gameRef.update({
//     teams
//   })
// }
