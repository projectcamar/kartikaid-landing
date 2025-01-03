const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { message } = JSON.parse(event.body);
        
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are Rio Anggara AI, an AI assistant that helps answer questions about Rio Anggara's background, experience, and achievements."
                },
                {
                    role: "user",
                    content: message
                }
            ],
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: completion.data.choices[0].message.content
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process request' })
        };
    }
}; 