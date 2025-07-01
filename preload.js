const { contextBridge } = require("electron");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Use native fetch if available (Node 18+), fallback to node-fetch
let fetchFn;
try {
  fetchFn = global.fetch || require("node-fetch");
} catch (e) {
  console.error("fetch not found – please install node-fetch: npm install node-fetch");
  throw e;
}

// Firebase config
const FIREBASE_URL = process.env.FIREBASE_URL;
const API_KEY = process.env.API_KEY;
const USER_ID = process.env.USER_ID;
const focusModeURL = `${FIREBASE_URL}/users/${USER_ID}/settings/focusMode.json?auth=${API_KEY}`;

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

contextBridge.exposeInMainWorld("firebaseAPI", {
  getUsername: () => USER_ID,
  setFocusMode,
  getFocusMode,
  resetFocusMode: () => setFocusMode(false)
});
