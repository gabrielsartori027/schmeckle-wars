export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No ANTHROPIC_API_KEY' });

  let query = '';
  try {
    let b = req.body;
    if (!b) {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      b = JSON.parse(raw);
    }
    if (typeof b === 'string') b = JSON.parse(b);
    query = b.query || '';
  } catch(e) {}

  if (!query) return res.status(400).json({ error: 'No query found', bodyType: typeof req.body, body: req.body });

  const today = new Date().toISOString().split('T')[0];
  const yday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: 'Search: "' + query + '" Find 2-4 CURRENT military events from last 24h. Today: ' + today + '. Only events from ' + today + ' or ' + yday + '. Map to: USA,ISRAEL,IRAN,FRANCE,RUSSIA,CHINA,NKOREA. Return ONLY JSON: [{"a":"CODE","t":"CODE","h":"headline max 90 chars","tp":"military|nuclear|cyber|intel","sv":1-10,"d":"' + today + '","url":"https://source.com/article"}]' }]
      })
    });
    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    return res.status(200).json(await r.json());
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}