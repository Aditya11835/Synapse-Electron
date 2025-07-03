let focusStateEl;
let statusIndicatorEl;
let userIdEl;

async function updateFocusUI() {
    try {
        const focusMode = await window.firebaseAPI.getFocusMode();

        if (focusMode === true) {
            focusStateEl.textContent = "ON";
            focusStateEl.classList.remove("off");
            focusStateEl.classList.add("on");

            statusIndicatorEl.classList.remove("off");
            statusIndicatorEl.classList.add("on");
        } else {
            focusStateEl.textContent = "OFF";
            focusStateEl.classList.remove("on");
            focusStateEl.classList.add("off");

            statusIndicatorEl.classList.remove("on");
            statusIndicatorEl.classList.add("off");
        }
    } catch (err) {
        console.error("Error updating focus UI:", err);
    }
}

if(window.firebaseAPI){
    document.addEventListener("DOMContentLoaded", () => {

        userIdEl = document.getElementById("userId");
        focusStateEl = document.getElementById("focusState");
        statusIndicatorEl = document.getElementById("statusIndicator");

        setInterval(updateFocusUI, 1000); // keep UI updated

        //First reset to false
        window.firebaseAPI?.setFocusMode(false)
        .then(() => {
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

