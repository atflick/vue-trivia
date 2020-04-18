import 'firebase/firestore'
import { initializeApp } from 'firebase'

export const db = initializeApp({
  apiKey: 'AIzaSyDhBAep0mMiuve54FRZyVH3oYXNmJbvjxs',
  authDomain: 'vue-trivia-94d5e.firebaseapp.com',
  databaseURL: 'https://vue-trivia-94d5e.firebaseio.com',
  projectId: 'vue-trivia-94d5e',
  storageBucket: 'vue-trivia-94d5e.appspot.com',
  messagingSenderId: '205718714727',
  appId: '1:205718714727:web:31da878c4f608cd9b457c2',
  measurementId: 'G-FNZGT92PXQ'
}).firestore()

export const gamesCollection = db.collection('games')
export const teamsCollection = db.collection('teams')
// export const addTeam = (gameRef, teamId) => {
//   gameRef.update({
//     teams
//   })
// }
