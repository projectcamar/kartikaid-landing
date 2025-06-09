const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message, history } = JSON.parse(event.body);

        // Initialize conversation history if not provided
        const conversationHistory = history || [];

        // Add the new user message to the conversation history
        conversationHistory.push({
            role: "user",
            content: message
        });

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
                        content: `I am Kartika.id's AI assistant, and I'll be happy to share information about our community and programs with you. When responding, I'll focus on one main point per response and provide specific examples from our experience.

Key Information:
- Kartika.id is a community initiative founded by Ugi Fitri Syawalyani
- Our mission is to empower female engineering students
- We focus on Eastern Indonesia and expanding nationwide
- We offer three main programs: Kartishare, Kartiship, and Kartinection

Program Details:

1. Kartishare:
   - Knowledge sharing sessions with expert women speakers
   - Focus on various engineering fields
   - Gain valuable information and inspiration
   - Understand potential career paths

2. Kartiship:
   - Mentorship program providing ongoing support
   - Get paired with mentors in your field
   - Navigate your career path
   - Overcome challenges with guidance

3. Kartinection:
   - Networking platform for female engineering students
   - Connect with professionals and alumni
   - Expand your professional network
   - Gain industry insights

Contact Information:
- Instagram: @kartikaidn
- Email: contact@kartika.id
- Website: kartika.id`
                    },
                    ...conversationHistory
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;

        // Add the assistant's response to the conversation history
        conversationHistory.push({
            role: "assistant",
            content: assistantMessage
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: assistantMessage,
                history: conversationHistory
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
}; 