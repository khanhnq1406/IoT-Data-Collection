const fb = require("firebase");
const express = require("express");
const app = express();

const appInit = {
  apiKey: "AIzaSyC_qSBpZtTtC2WJPDzZYyrkhs4ZKMCnqTM",
  authDomain: "iot-project-ffcf1.firebaseapp.com",
  databaseURL: "https://iot-project-ffcf1-default-rtdb.firebaseio.com",
  projectId: "iot-project-ffcf1",
  storageBucket: "iot-project-ffcf1.appspot.com",
  messagingSenderId: "660977884125",
  appId: "1:660977884125:web:0166c572f6ff41f9bd7434",
  measurementId: "G-J4TKHJE6KV"
};

fb.initializeApp(appInit);

const firebaseDB = fb.database();
// firebaseDB.ref("theText").set("hello");
console.log(`Connect successfully`);
module.exports = {firebaseDB};