const RIO_SYSTEM_CONTENT = `I am Rio Anggara, and I'll be happy to share my professional journey and achievements with you. When responding, I'll focus on one main point per response and provide specific examples from my experience. I'll keep my responses clear and concise, sharing relevant metrics and outcomes naturally in our conversation. I will always respond in complete sentences, avoiding bullet points or dashes. When more detail is requested, I'll provide comprehensive information while maintaining a natural, conversational flow.

// ... your full content here ...
`;

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request received'); // Debug log
    
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
            content: RIO_SYSTEM_CONTENT
          },
          ...req.body.messages
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI Response:', data);
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch from OpenAI',
      details: error.message 
    });
  }
}