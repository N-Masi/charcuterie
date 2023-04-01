# Official Webpage for Brown University's Charcuterie Club

View online at `https://charcuterie-club.wep.app`

This project was built using Node, Express, & HTML. It is deployed using Firebase.

## Initial Setup

To install all the required dependencies run ```npm install```

## Building Locally

To host a version of the website locally:
```
node charcuterie-site/public/index.js
```
You can then view the website at `http://localhost:13370/` in a browser

## Deploying

Go to the charcuterie-site directory
Make sure ```firebase-tools``` is npm installed
In terminal run ```firebase login``` to and sign in to whatever firebase account is connected to the firebase project
In terminal run ```firebase deploy```. (You may have an issue that says this can't be deployed because running scripts is disabled on this system. In this case, simply delete the `firebase.ps1` file from your firebase directory and retry)

## TODO:

* add background to game & a button back to homepage
* deploy to firebase