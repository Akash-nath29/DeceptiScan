async function scrapeAndDetect() {
    function extractChunks() {
        let elements = document.querySelectorAll(`
            main, 
            article, 
            section, 
            div:not([role="navigation"]):not([id*="nav"]):not([class*="nav"]):not([role="banner"]),
            p, 
            span, 
            h1, h2, h3, h4, h5, h6, 
            li, 
            blockquote, 
            strong, 
            em, 
            b, 
            i
        `);

        let chunks = [];

        elements.forEach(el => {
            let text = el.textContent.trim();
            if (text) {
                chunks.push({ text, element: el });
            }
        });

        return chunks;
    }

    let chunks = extractChunks();
    let requestBody = { tokens: chunks.map(c => c.text) };

    try {
        let response = await fetch("https://027c-2409-40e0-102a-ac59-650d-5c1d-f412-4653.ngrok-free.app/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        let data = await response.json();

        // Apply classification results
        chunks.forEach((chunk, index) => {
            let detectedPattern = data.result[index]; // Example: "Scarcity", "Urgency", etc.

            if (detectedPattern !== "Not Dark") {
                let { element } = chunk;
                highlight(element, detectedPattern);
            }
        });
        // document.querySelector("#score").innerText = data.score;
    } catch (error) {
        console.error("Error fetching API:", error);
    }
}

function highlight(element, classifications) {
    // Remove "Not Dark" entries and check if any patterns remain
    classifications = classifications.filter(c => c.pattern !== "Not Dark");

    if (classifications.length === 0) return; // Skip highlighting if only "Not Dark" was detected

    // Add a glowing red border to the element
    element.style.outline = "3px solid red";
    element.style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.8)";
    element.style.position = "relative";

    // Create a container for the labels
    let container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "10px";
    container.style.left = "-10px";
    container.style.zIndex = "9999";
    container.style.fontWeight = "bold";
    container.style.borderRadius = "5px";
    container.style.padding = "5px";
    container.style.display = "inline-block";

    // Function to determine color based on confidence
    function getColor(confidence) {
        if (confidence <= 0.35) return "rgba(0, 200, 0, 0.9)"; // Green for low confidence
        if (confidence <= 0.65) return "rgba(255, 165, 0, 0.9)"; // Orange for medium confidence
        return "rgba(255, 0, 0, 0.9)"; // Red for high confidence
    }

    // Append labels for each detected pattern
    classifications.forEach(({ pattern, confidence }) => {
        let tag = document.createElement("div");
        tag.style.backgroundColor = getColor(confidence);
        tag.style.color = "white";
        tag.style.padding = "6px";
        tag.style.margin = "4px 0";
        tag.style.fontSize = "14px";
        tag.style.borderRadius = "3px";
        tag.innerText = `⚠️ ${pattern} (${(confidence * 100).toFixed(1)}%)`;

        container.appendChild(tag);
    });

    // Append the tag container to the element
    element.appendChild(container);
}



// Run detection
scrapeAndDetect();
