# iSee - One-Time One-on-One Video Call Web App

Welcome to iSee, a one-time one-on-one video call web application built with React, WebRTC's peer-to-peer connections, and designed using Tailwind CSS. iSee allows you to quickly set up a video call with someone without the need for accounts or installations. This README will guide you through the features, technologies used, and how to get started with iSee.

Link to live site - [https://fabulous-sundae-c611c5.netlify.app/](iSee)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Responsive Design](#responsive-design)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

iSee is designed to provide a seamless one-time one-on-one video call experience with the following features:

1. **One-Time One-on-One Video Call:** Quickly initiate a one-time video call with a unique code or invitation link.
2. **Live Chat:** Chat with your call partner in real-time during the video call.
3. **Change Name:** Customize your display name before the call to maintain privacy.
4. **Send Invite:** Share an invitation link with your unique one-time code with others to join the call quickly.
5. **No Account Required:** No need to sign up or log in; just paste the code and start the call.
6. **Live Chat with Photo:** Share photos and images during the chat to enhance your conversation.

## Technologies Used

iSee is built using the following technologies and libraries:

- **React.js:** A JavaScript library for building user interfaces.
- **Tailwind CSS:** A utility-first CSS framework for designing responsive and attractive user interfaces.
- **Node.js:** A runtime environment for executing JavaScript on the server.
- **Express.js:** A web application framework for Node.js used to create the backend.
- **Socket.io:** A library for real-time, bidirectional communication between clients and servers.
- **WebRTC:** A web technology for real-time communication between browsers.
- **React-Redux:** A predictable state container for managing application state.
- **Simple-peer:** A WebRTC peer-to-peer library for easy peer connections.
- **Lottie Files:** Animated SVGs for enhancing the user experience.
- **Lucide:** A library for icons to improve the app's visual appeal.

## Responsive Design

iSee is designed with a responsive layout, ensuring that it adapts seamlessly to various screen sizes and devices. Whether you're using a desktop computer, tablet, or smartphone, iSee will provide an optimal user experience.

## Getting Started

Follow these steps to get iSee up and running on your local machine:

1. Clone the repository:
   ```bash
   git clone https://github.com/naseeb7/iSee-client.git
   git clone https://github.com/naseeb7/iSee-server.git
   ```

2. Install the dependencies for both the client and server:

   ```bash
   # Install client dependencies
   cd iSee-client
   npm install

   # Install server dependencies
   cd iSee-server
   npm install
   ```

4. Start the client and server separately:

   - Start the client (React app):
     ```bash
     npm start
     ```

   - Start the server (Express.js):
     ```bash
     node index.js
     ```

5. Open your browser and visit [http://localhost:3000](http://localhost:3000) to use iSee locally.

## Usage

Using iSee is straightforward:

1. To initiate a video call:
   - Copy the unique code provided.
   - Share this code with your call partner.
   - Alternatively, click "Send Invite" to share your unique one-time code with an invitation link and share it.

2. To join the video call:
   - Paste the unique code (shared directly or with the invitation link).
   - Enter your name to set your display name or not.
   - Click "Call" to start the video call and wait for the other end to answer.

3. During the call, you can use the live chat feature to communicate with your partner in real-time, including sending photos and images.

<div align="center">
  <img src="https://your-image-url.com" alt="iSee App Screenshot" width="600">
</div>

Thank you for using iSee! If you have any questions or encounter any issues, please don't hesitate to contact me. Happy video calling!

---