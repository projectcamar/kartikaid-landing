const fetch = require('node-fetch');
const rioContent = require('../../rio-content.js');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message } = JSON.parse(event.body);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini-2024-07-18",
                messages: [
                    {
                        role: "system",
                        content: rioContent
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
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