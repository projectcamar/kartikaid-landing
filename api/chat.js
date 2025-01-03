// Import from public directory
const RIO_SYSTEM_CONTENT = require('../public/rio-content.js').RIO_SYSTEM_CONTENT;

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Attempting OpenAI request...'); // Debug log
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: RIO_SYSTEM_CONTENT
          },
          ...req.body.messages
        ],
        temperature: 0.7, // Lowered temperature for more consistent responses
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI Error:', errorData); // Debug log
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI Response:', data); // Debug log
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error); // Debug log
    return res.status(500).json({ 
      error: 'Failed to fetch from OpenAI',
      details: error.message 
    });
  }
}