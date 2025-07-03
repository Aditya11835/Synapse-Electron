# 🧠 Synapse – Electron Focus Broadcaster
A lightweight **Electron-based focus state manager** that syncs your focus mode across devices using Firebase. Designed to work with the full **Synapse ecosystem** (Mobile App + Chrome Extension), this app ensures real-time sync of your working state to block distractions on phones and browsers.

---

## ✅ Features
- Syncs focusMode status to Firebase Realtime Database.
- Auto-resets focusMode to OFF on app load and exit for safety.
- Visual status indicators for current focus state (ON/OFF).
- Graceful error handling with console logging.
- Shows formatted user ID in UI (XXXX-XXXX).
- Works seamlessly with Flutter mobile app and Chrome extension for unified focus control.
- Secure preload architecture with contextBridge, blocking direct Node.js access in the renderer.
- Background scanning of running processes to detect whitelisted apps (e.g., Chrome, Notion).
- Automatically kills blacklisted apps (e.g., Spotify) when focus mode is triggered.
- Unique user ID auto-generated and saved locally.
- Periodically polls Firebase to reflect real-time changes in UI.
- Prevents redundant Firebase writes using intelligent internal state flags.
- Designed to run silently and continuously in fullscreen for immersive workflows.

---

## 🧩 Requirements

- *Currently only compatible with Windows*
- *Node.js v16+*
- *Firebase Project with Realtime Database*

---

## 🛠 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aditya11835/Synapse-Electron.git
cd synapse-electron
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a .env file in the root directory:
```bash
FIREBASE_URL=https://your-database-url.firebaseio.com
API_KEY=your_firebase_web_api_key
```

## ▶️ Run the App
```bash
npm run start
```

---

## 🌐 Works With
| Component           | Repo                                                                       |
| ------------------- | -------------------------------------------------------------------------- |
| 📱 Flutter App      | [Synapse-Mobile](https://github.com/Utsavvv1/browser-ext)                  |
| 🌐 Chrome Extension | [Synapse-Extension](https://github.com/Zyphon12342/HarmonicDistruptionApp) |

## 👥 Contributors
| Name                  | GitHub                                                         |
| --------------------- | -------------------------------------------------------------- |
| Utsav Verma           | [@Utsavvv1](https://github.com/Utsavvv1)                       |
| Aaryan Singh Rathore  | [@AaryanSingthRathore](https://github.com/AaryanSingthRathore) |
| Anomitra Bhattacharya | [@anomitroid](https://github.com/anomitroid)                   |
| Aditya Negi           | [@Aditya11835](https://github.com/Aditya11835)                 |
| Shivansh Kandpal      | [@Zyphon12342](https://github.com/Zyphon12342)                 |

## 📜 License
This project is licensed under the ICS License.