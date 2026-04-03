# CryptX – Offline Mesh-Based Disaster Communication System

## Problem Statement

During natural disasters such as floods, earthquakes, or landslides, traditional communication networks often fail. This leaves affected individuals unable to send distress signals or request help.

There is a critical need for a system that enables communication without relying on internet or cellular networks.

## Proposed Solution

CryptX is a decentralized, mesh-based communication system that allows users to send SOS signals without internet connectivity.

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

## How to Run the Project

1. Clone the repository:
   git clone https://github.com/your-username/cryptx.git

2. Navigate to the project:
   cd cryptx

3. Install dependencies:
   npm install

4. Start the development server:
   npm run dev

5. Open in browser:
   http://localhost:5173

## Team Details
- Team name: Wecodex
- Team Members:
   - Pooja Anbalagan
   - Aradhya Jayawardane


University: [Sabaragamuwa University of Sri Lanka]
Domain: Disaster Management & Community Resilience

