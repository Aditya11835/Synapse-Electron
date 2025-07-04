/**
 * preload.js
 * - Manages user ID
 * - Handles process detection (white/black list)
 * - Syncs focusMode state with Firebase
 * - Exposes Firebase control to renderer
 */

const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { customAlphabet } = require("nanoid");
const si = require('systeminformation');
const fkill = require('fkill').default;

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
const generateUserId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 8);

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
    } else {
        USER_ID = fs.readFileSync(userIdFile, "utf-8").trim();
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
    return result;
}

async function getFocusMode() {
    const response = await fetchFn(focusModeURL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
}

let WHITELIST = [
    "notion.exe",           // Note-taking & productivity
    /*"code.exe",*/             // VS Code - Coding/Dev work
    "word.exe",             // Microsoft Word
    "excel.exe",            // Microsoft Excel
    "powerpoint.exe",       // Microsoft PowerPoint
    "onenote.exe",          // Microsoft OneNote
    "outlook.exe",          // Microsoft Outlook - Email
    "teams.exe",            // Microsoft Teams - Meetings
    "zoom.exe",             // Zoom - Video conferencing
    "slack.exe",            // Slack - Work chat
    "acrobat.exe",          // Adobe PDF reader/editor
    "notepad.exe",          // Simple text editing
    "figma.exe"            // UI/UX design
];

let BLACKLIST = [
    "spotify.exe",          // Music streaming
    "discord.exe",          // Gaming + casual chats
    "instagram.exe",        // Social media
    "facebook.exe",         // Social media
    "telegram.exe",         // Messaging
    "messenger.exe",        // Facebook Messenger
    "tiktok.exe",           // Social video app
    "netflix.exe",          // Video streaming
    "primevideo.exe",       // Video streaming
    "youtube.exe",          // Desktop YouTube app
    "vlc.exe",              // Media player
    "reddit.exe",           // Reddit desktop app
    "pinterest.exe",        // Browsing distractions
    "games.exe",            // Generic game launcher
    "epicgameslauncher.exe",// Gaming
    "steam.exe",            // Gaming
    "battlenet.exe",        // Gaming
];


const killBlackListProcess = async (killList) => {
    try{
        if(killList.length === 0){
            return;
        }
        for(const proc of killList){
            try{
                await fkill(proc.pid, { force: true, tree: true }); //Only for Windows
            }
            catch(err){
                console.error(`Error handling ${proc.name}:`, err);
            }
        }
    }
    catch{
        console.error("Failed.");
    }
}

let focusModeActive = false;
const detectWhiteListProcess = async () => {
    try {
        const data = await si.processes();
        const procList = data.list;
        const targetList = procList.filter(proc => WHITELIST.includes(proc.name.toLowerCase()));

        if (targetList.length !== 0) {
            if (!focusModeActive) {
                await setFocusMode(true);
                focusModeActive = true;
            }

            BLACKLIST = BLACKLIST.filter(b => !WHITELIST.includes(b));
            const killList = procList.filter(proc => BLACKLIST.includes(proc.name.toLowerCase()));
            if(killList.length !== 0){
                if (focusModeActive) {
                    ipcRenderer.send("trigger-popup");
                    await killBlackListProcess(killList);
                }
            }
        } else if (focusModeActive) {
            await setFocusMode(false);
            focusModeActive = false;
        }
    } catch (err) {
        console.error("Failed to fetch processes:", err);
    }
};

let isRunning = false;
const INTERVAL = 1500;
setInterval(async () => {
    if (isRunning) return;
    isRunning = true;
    try {
        await detectWhiteListProcess();
    } catch (e) {
        console.error("Error in detectWhiteListProcess:", e);
    }
    isRunning = false;
}, INTERVAL);

//Make firebaseAPI for renderer.js
contextBridge.exposeInMainWorld("firebaseAPI", {
    getUsername: () => USER_ID,
    setFocusMode,
    getFocusMode,
    resetFocusMode: () => setFocusMode(false)
});
contextBridge.exposeInMainWorld("electronAPI", {
    exitPopup: () => {
        ipcRenderer.send("terminate-popup")
    }
});