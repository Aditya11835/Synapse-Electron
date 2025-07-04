console.log("popupRenderer loaded");

window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");

    const exitButton = document.getElementById("exit");

    if (exitButton) {
        console.log("Exit button found");

        exitButton.addEventListener("click", () => {
            console.log("Exit button clicked");

            if (window.electronAPI?.exitPopup) {
                console.log("Calling exitPopup...");
                window.electronAPI.exitPopup();
            } else {
                console.error("window.electronAPI.exitPopup not available");
            }
        });
    } else {
        console.error("Exit button not found");
    }
});
