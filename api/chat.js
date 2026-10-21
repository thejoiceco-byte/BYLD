export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { messages, code } = req.body || {};
  if (code !== process.env.ACCESS_CODE) {
    return res.status(401).json({ error: 'Wrong access code' });
  }
  if (!Array.isArray(messages) || messages.length > 31) {
    return res.status(400).json({ error: 'Bad messages' });
  }
  const r = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.XAI_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1200
    })
  });
  const data = await r.json();
  if (!r.ok) {
    return res.status(502).json({ error: 'AI provider error' });
  }
  res.status(200).json({ content: data.choices?.[0]?.message?.content || '' });
}
