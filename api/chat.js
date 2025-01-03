const SYSTEM_CONTENT = "I am Rio Anggara AI, an AI assistant trained to provide information about Rio Anggara's professional background, achievements, and experiences.";

export default async function handler(req, res) {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the incoming request
    console.log('Received request:', req.body);

    // Test response without calling OpenAI
    return res.status(200).json({
      choices: [{
        message: {
          content: "This is a test response to verify the API connection is working."
        }
      }]
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
}