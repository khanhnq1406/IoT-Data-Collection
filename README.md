# IoT Data Collection

This is an IoT Data Collection project

## Folder structure

```
├── demo_images
│   ├── Version 1
│   │   ├── image.file
│   ├── Version 2
│   │   ├── image.file
├── src
│   ├── esp (for esp coding)
│   │   ├── ...
│   │   ├── Esp Folders
│   │   ├── ...
│   ├── website (website for version 1)
│   │   ├── ...
│   │   ├── Website Folder Structure
│   │   ├── ...
│   ├── graduation_project (website for version 2)
│   │   ├── client (ReactJS folder)
│   │   │   ├── ...
│   │   │   ├── ReactJS Folder Structure
│   │   │   ├── ...
│   │   ├── server (NodeJS folder)
│   │   │   ├── ...
│   │   │   ├── NodeJS Folder Structure
│   │   │   ├── ...
├── .gitignore
└── README.md
```

## Technologies in project

### Version 1

- Website: NodeJS, ExpressJS, Express Handlebars, Bootstrap
- Database: Firebase Realtime Database
- Deployment: Heroku, Cyclic
- Protocol: Adafruit IO (MQTT), LoRa

### Version 2

- Website: NodeJS, ReactJS, Bootrstrap
- Database: PostgreSQL
- Deployment: Vercel, Render, Supabase
- Protocol: LoRa, PLC TCP/IP communication

## How to use repository

- We will code in `src` folder. You can create new folder in `src` for your task (such as website, ESP32, LoRa,...).
- **Note:** Remember to `pull` code before working and `push` code after coding.
- You can take note your solution to solve problem or everything in `notes` folder by _.md_ files.

## Deploy step

### Server

1. Notice that package.json has script `"start": "node --inspect index.js"` that is adapted for deployment environments.
2. Setting .env file in https://dashboard.render.com/web/[project link]/env

### Client

1. Remove return() in create chart step
2. Change `apiUrl` and `homeUrl` in constant.js

## Demo
<img src="demo_images/Version 2/6-page.png"/>

<img src="demo_images/Version 2/alarm.png"/>

<img src="demo_images/Version 2/filter.png"/>

<img src="demo_images/Version 2/noded3_result.png"/>

<img src="demo_images/Version 2/role.png"/>

<img src="demo_images/Version 2/table.png"/>
