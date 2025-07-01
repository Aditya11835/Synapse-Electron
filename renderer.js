document.addEventListener("DOMContentLoaded", () => {
  console.log("firebaseAPI available?", window.firebaseAPI);

  const userIdEl = document.getElementById("userId");
  if (userIdEl && window.firebaseAPI?.getUsername) {
    const username = window.firebaseAPI.getUsername();
    userIdEl.textContent = `${username.substring(0, 4)}-${username.substring(4)}`;
  }

  const focusStateEl = document.getElementById("focusState");
  const statusIndicatorEl = document.getElementById("statusIndicator");

  const focusOnBtn = document.getElementById("focusOnBtn");
  const focusOffBtn = document.getElementById("focusOffBtn");

  // 🔘 Focus ON button
  if (focusOnBtn) {
    focusOnBtn.addEventListener("click", () => {
      // Update UI
      focusStateEl.textContent = "ON";
      focusStateEl.classList.remove("off");
      focusStateEl.classList.add("on");

      statusIndicatorEl.classList.remove("off");
      statusIndicatorEl.classList.add("on");

      // ✅ Push to Firebase
      window.firebaseAPI.setFocusMode(true)
        .then(() => console.log("✅ focusMode set to true"))
        .catch(err => console.error("❌ Error writing focusMode:", err));
    });
  }

  // 🔘 Focus OFF button
  if (focusOffBtn) {
    focusOffBtn.addEventListener("click", () => {
      // Update UI
      focusStateEl.textContent = "OFF";
      focusStateEl.classList.remove("on");
      focusStateEl.classList.add("off");

      statusIndicatorEl.classList.remove("on");
      statusIndicatorEl.classList.add("off");

      // ✅ Push to Firebase
      window.firebaseAPI.setFocusMode(false)
        .then(() => console.log("✅ focusMode set to false"))
        .catch(err => console.error("❌ Error writing focusMode:", err));
    });
  }

  // 🔄 Optional: Load current state from Firebase on load
  if (window.firebaseAPI?.getFocusMode) {
    window.firebaseAPI.getFocusMode()
      .then((state) => {
        if (state === true) {
          focusStateEl.textContent = "ON";
          focusStateEl.classList.add("on");
          statusIndicatorEl.classList.add("on");
        } else {
          focusStateEl.textContent = "OFF";
          focusStateEl.classList.add("off");
          statusIndicatorEl.classList.add("off");
        }
      })
      .catch(err => console.error("❌ Could not load focusMode from Firebase:", err));
  }
});
