chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "detect_dark_patterns") {
        fetch("http://127.0.0.1:8000/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tokens: request.sentences })
        })
            .then(response => response.json())
            .then(data => sendResponse(data))
            .catch(error => console.error("Error:", error));

        return true; // Keep the message channel open for async response
    }
});
