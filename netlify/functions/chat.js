const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body);
        let messages;

        // Handle both single message and conversation history formats
        if (body.message) {
            // Single message format (from index.html)
            messages = [
                {
                    role: "system",
                    content: `I am Rio Anggara, and I'll be happy to share my professional journey and achievements with you. When responding, I'll focus on one main point per response and provide specific examples from my experience. I'll keep my responses clear and concise, sharing relevant metrics and outcomes naturally in our conversation. I will always respond in complete sentences, avoiding bullet points or dashes. When more detail is requested, I'll provide comprehensive information while maintaining a natural, conversational flow.

                    // ... (rest of Rio's system prompt)
                    `
                },
                {
                    role: "user",
                    content: body.message
                }
            ];
        } else {
            // Conversation history format (from chatbot.html)
            messages = body.messages;
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: data.choices[0].message.content
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to process request',
                details: error.message
            })
        };
    }
}; 