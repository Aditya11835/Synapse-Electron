window.addEventListener('DOMContentLoaded', () => {
    const exitButton = document.getElementById("exit");
    if (exitButton) {
        exitButton.addEventListener("click", () => {
            if (window.electronAPI?.exitPopup) {
                window.electronAPI.exitPopup();
            } else {
                console.error("window.electronAPI.exitPopup not available");
            }
        });
    } else {
        console.error("Exit button not found");
    }
});
