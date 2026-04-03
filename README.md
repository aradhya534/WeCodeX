# MeshSOS – Offline Mesh-Based Disaster Communication System

## Problem Statement

During natural disasters such as floods, earthquakes, or landslides, traditional communication networks often fail. This leaves affected individuals unable to send distress signals or request help.

There is a critical need for a system that enables communication without relying on internet or cellular networks.

## Proposed Solution

MeshSOS is a decentralized, mesh-based communication system that allows users to send SOS signals without internet connectivity.

The system uses nearby devices to relay distress messages through a multi-hop network using TTL (Time-To-Live) and hop count logic.

Key Features:
- SOS signal with GPS location
- Peer-to-peer message relay (simulated mesh network)
- Offline data access using IndexedDB
- Progressive Web App (PWA) for offline functionality
- Emergency message propagation until internet is reached
This system does not guarantee instant delivery, but ensures eventual communication under extreme conditions.

## User Roles

### 1. Stranded Civilian
Sends SOS signals with location and severity even without internet.

### 2. Volunteer (Relay Node)
Automatically relays distress signals across devices without user intervention.

### 3. Emergency Responder
Receives structured distress data (location, severity, hops) to prioritize rescue efforts.

## Tech Stack

Frontend:
- React (Vite)
- Tailwind CSS

Device APIs:
- Geolocation API
- (Simulated) Web Bluetooth & WebRTC

Storage:
- IndexedDB

Offline Support:
- Service Worker (PWA)

Backend (Optional / Simulated):
- Node.js (Express)
- Twilio API (for SMS alerts)

## Architecture Overview

The system follows a decentralized mesh communication model:

1. User creates a distress packet
2. Packet is broadcast to nearby devices
3. Each device relays the message:
   - TTL decreases
   - Hop count increases
4. Once any device gains internet access, the message is forwarded to a backend server
5. Emergency responders receive the alert

                        +---------------------+
                        | Stranded Civilian |
                        | (Send SOS) |
                        +----------+----------+
                        |
                        v
                        +---------------------+
                        | Distress Packet |
                        | (GPS, Severity, |
                        | TTL, Hops) |
                        +----------+----------+
                        |
                        v
                        +---------------------+
                        | Mesh Network |
                        | (Nearby Devices) |
                        | - Relay Messages |
                        | - Decrease TTL |
                        | - Increase Hops |
                        +----------+----------+
                        |
                        v
                        +---------------------+
                        | Internet Gateway |
                        | (Any device with |
                        | connectivity) |
                        +----------+----------+
                        |
                        v
                        +---------------------+
                        | Backend Server |
                        | (Process SOS Data) |
                        +----------+----------+
                        |
                        v
                        +---------------------+
                        | Emergency Responder |
                        | (Receive & Act) |
                        +---------------------+

## How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/aradhya534/WeCodeX.git
```

### 2. Navigate into the project folder

```bash
cd WeCodeX
```


## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open in browser:

```
http://localhost:5173
```

## Run Backend

```bash
cd backend
npm install
npm start
```

## Notes

* Run **backend first**, then frontend
* Make sure backend is running on the correct port (e.g., `http://localhost:5000`)
* If frontend uses API calls, check the API base URL is correct

## Prerequisites

* Node.js (v16 or higher)
* npm


## Team Details
- Team name: Wecodex
- Team Members:
   - Pooja Anbalagan
   - Aradhya Jayawardane


University: Sabaragamuwa University of Sri Lanka
Domain: Disaster Management & Community Resilience

