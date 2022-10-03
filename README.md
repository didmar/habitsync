# Habitsync: Habit Tracking App

The goal of this project is to create a habit tracking app that:
- is multiplatform (web, Android and iOS)
- can work offline
- synchronizes data bi-directionally, to interact with the tracker programmatically outside the app  

![screenshot](screenshot.png)

## Setup

- Go to Firebase and create a new Firebase project with a Firestore

- Create a `src/firestore.creds.json` file and copy the configuration from your Firebase project. It should look like this:

```json
{
  "apiKey": "XXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXX",
  "authDomain": "your-project-id.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project-id.appspot.com",
  "messagingSenderId": "000000000000",
  "appId": "1:000000000000:web:0000000000000000000000",
  "measurementId": "G-0000000000"
}
```

- Install Node.js

- Run the following commands in the terminal:

```bash
# Install the Ionic CLI globally
npm install -g @ionic/cli

# Install the rest of the dependencies
npm install

# Run the server
# (Adding the external flag to connect from other devices on the local network)
ionic serve --external
```

- For building the Android app, run `./build_android.sh` and download the APK from http://localhost:8100/assets/app.apk
