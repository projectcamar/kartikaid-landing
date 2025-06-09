export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const systemContent = `I am Kartika.id's AI assistant, and I'll be happy to share information about our community and programs with you. When responding, I'll focus on one main point per response and provide specific examples from our experience.

Key Information:
- Kartika.id is a community initiative founded by Ugi Fitri Syawalyani
- Our mission is to empower female engineering students
- We focus on Eastern Indonesia and expanding nationwide
- We offer three main programs: Kartishare, Kartiship, and Kartinection

Contact Information:
- Instagram: @kartikaidn
- Email: contact@kartika.id
- Website: kartika.id`;

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
            content: systemContent
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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json({ 
      message: data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}