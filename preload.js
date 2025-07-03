const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { customAlphabet } = require("nanoid");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Use native fetch if available (Node 18+), fallback to node-fetch
let fetchFn;
try {
    fetchFn = global.fetch || require("node-fetch");
} catch (e) {
    console.error("fetch not found please install node-fetch: npm install node-fetch");
    throw e;
}

// Generate 8-character uppercase alphanumeric ID
const generateUserId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);

// Setup data directory and user_id.txt
const dataDir = path.resolve(__dirname, "data");
const userIdFile = path.join(dataDir, "user_id.txt");
let USER_ID;
try {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    if (!fs.existsSync(userIdFile)) {
        USER_ID = generateUserId();
        fs.writeFileSync(userIdFile, USER_ID, "utf-8");
        console.log("Generated new USER_ID:", USER_ID);
    } else {
        USER_ID = fs.readFileSync(userIdFile, "utf-8").trim();
        console.log("Loaded existing USER_ID:", USER_ID);
    }
}
catch (err) {
    console.error("Error managing USER_ID:", err.message);
    throw err;
}

// Firebase config
const FIREBASE_URL = process.env.FIREBASE_URL;
const API_KEY = process.env.API_KEY;
const focusModeURL = `${FIREBASE_URL}/users/${USER_ID}/settings/focusMode.json?auth=${API_KEY}`;

//set and get DB functions
async function setFocusMode(value) {
    const response = await fetchFn(focusModeURL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log(`focusMode set to ${value}`);
    return result;
}

async function getFocusMode() {
    const response = await fetchFn(focusModeURL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log("focusMode from Firebase:", data);
    return data;
}

//Make firebaseAPI for renderer.js
contextBridge.exposeInMainWorld("firebaseAPI", {
    getUsername: () => USER_ID,
    setFocusMode,
    getFocusMode,
    resetFocusMode: () => setFocusMode(false)
});
contextBridge.exposeInMainWorld('testAPI', {
    startPing: () => ipcRenderer.send('start-ping'),
    onPong: (callback) => ipcRenderer.on('pong', (_, data) => callback(data))
});