async function query(userMessage) {
    try {
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.message;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
} 