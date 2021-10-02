import {initializeApp} from "firebase/app"

const config = require('./firestore.creds.json');

const firebaseApp = initializeApp(config);

export default firebaseApp;