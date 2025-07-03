if(window.firebaseAPI){
    document.addEventListener("DOMContentLoaded", () => {

        const userIdEl = document.getElementById("userId");
        const focusStateEl = document.getElementById("focusState");
        const statusIndicatorEl = document.getElementById("statusIndicator");
        const focusOnBtn = document.getElementById("focusOnBtn");
        const focusOffBtn = document.getElementById("focusOffBtn");

        //First reset to false
        window.firebaseAPI?.setFocusMode(false)
        .then(() => {
            console.log("focusMode reset to false on load");
            //After resetting, reflect UI state
            focusStateEl.textContent = "OFF";
            focusStateEl.classList.add("off");
            focusStateEl.classList.remove("on");
            statusIndicatorEl.classList.add("off");
            statusIndicatorEl.classList.remove("on");
        })
        .catch(err => console.error("Error resetting focusMode on load:", err));
        
        if (userIdEl && window.firebaseAPI?.getUsername) {
        const username = window.firebaseAPI.getUsername();
        userIdEl.textContent = `${username.substring(0, 4)}-${username.substring(4)}`;
        }
        
        // Focus ON button
        if (focusOnBtn) {
        focusOnBtn.addEventListener("click", () => {
            focusStateEl.textContent = "ON";
            focusStateEl.classList.remove("off");
            focusStateEl.classList.add("on");

            statusIndicatorEl.classList.remove("off");
            statusIndicatorEl.classList.add("on");

            window.firebaseAPI.setFocusMode(true)
            .then(() => console.log("focusMode set to true"))
            .catch(err => console.error("Error writing focusMode:", err));
        });
        }

        // Focus OFF button
        if (focusOffBtn) {
        focusOffBtn.addEventListener("click", () => {
            focusStateEl.textContent = "OFF";
            focusStateEl.classList.remove("on");
            focusStateEl.classList.add("off");

            statusIndicatorEl.classList.remove("on");
            statusIndicatorEl.classList.add("off");

            window.firebaseAPI.setFocusMode(false)
            .then(() => console.log("focusMode set to false"))
            .catch(err => console.error("Error writing focusMode:", err));
        });
        }

        // Handle app quit — reset focusMode to false before exit
        window.onbeforeunload = async (e) => {
        e.returnValue = false; // Prevents immediate close

        try {
            await window.firebaseAPI.resetFocusMode();
            console.log("focusMode reset successfully. Proceeding with quit.");

            // Unbind and allow quit
            window.onbeforeunload = null;
            window.close();
        } catch (err) {
            console.error("Error resetting focusMode before quit:", err);
            window.onbeforeunload = null;
            window.close(); // Proceed anyway on failure
        }
        };
    });
}
else{
    console.log("FirebaseAPI could not load.")
    const userIdEl = document.getElementById("userId");
    const focusStateEl = document.getElementById("focusState");
    const statusIndicatorEl = document.getElementById("statusIndicator");

    userIdEl.textContent = "NOT-FOUND"
    focusStateEl.textContent = "ERROR";
    focusStateEl.classList.add("off");
    focusStateEl.classList.remove("on");
    statusIndicatorEl.classList.remove("on");
    statusIndicatorEl.classList.add("off");
}