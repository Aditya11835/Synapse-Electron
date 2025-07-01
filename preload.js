const { contextBridge } = require("electron");
const dotenv = require("dotenv");
const path = require("path");

// Use native fetch if available (Node 18+), fallback to node-fetch
let fetchFn;
try {
  fetchFn = global.fetch || require("node-fetch");
} catch (e) {
  console.error("fetch not found – please install node-fetch: npm install node-fetch");
  throw e;
}

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const FIREBASE_URL = process.env.FIREBASE_URL;
const API_KEY = process.env.API_KEY;
const USER_ID = process.env.USER_ID;

contextBridge.exposeInMainWorld("firebaseAPI", {
  getUsername: () => USER_ID,

  //Set focusMode value (true/false) in Firebase
  setFocusMode: async (isEnabled) => {
    const url = `${FIREBASE_URL}/users/${USER_ID}/settings/focusMode.json?auth=${API_KEY}`;
    try {
      const response = await fetchFn(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEnabled),
      });

      const result = await response.json();
      console.log(`focusMode set to ${isEnabled}`);
      return result;
    } catch (error) {
      console.error("Error setting focusMode:", error.message);
      throw error;
    }
  },

  //Get current focusMode value from Firebase
  getFocusMode: async () => {
    const url = `${FIREBASE_URL}/users/${USER_ID}/settings/focusMode.json?auth=${API_KEY}`;
    try {
      const response = await fetchFn(url);
      const data = await response.json();

      console.log("focusMode from Firebase:", data);
      return data;
    } catch (error) {
      console.error("Error reading focusMode:", error.message);
      throw error;
    }
  }
});
