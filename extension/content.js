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

function highlight(element, pattern) {
    // Add a glowing red border
    element.style.outline = "3px solid red";
    element.style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.8)";
    element.style.position = "relative";

    // Create a label
    let tag = document.createElement("div");
    tag.style.backgroundColor = "rgba(255, 0, 0, 0.9)";
    tag.style.color = "white";
    tag.style.padding = "8px";
    tag.style.marginTop = "8px";
    tag.style.fontSize = "14px";
    tag.style.fontWeight = "bold";
    tag.style.borderRadius = "5px";
    tag.style.display = "inline-block";
    tag.style.position = "absolute";
    tag.style.top = "10px";
    tag.style.left = "-10px";
    tag.style.zIndex = "9999";  // Ensures it appears on top
    tag.innerText = `⚠️ ${pattern}`; // Adds a warning emoji to grab attention
    tag.style.opacity = "0.5";

    // Append the tag
    element.appendChild(tag);
}


// Run detection
scrapeAndDetect();
