chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "detect_dark_patterns") {
        fetch("https://027c-2409-40e0-102a-ac59-650d-5c1d-f412-4653.ngrok-free.app/", {
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
