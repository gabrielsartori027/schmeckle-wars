export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key' });

  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'No q param' });

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
        messages: [{ role: 'user', content: 'Search: "' + query + '" Find 2-4 CURRENT military events from last 24h. Today: ' + today + '. Only from ' + today + ' or ' + yday + '. Codes: USA,ISRAEL,IRAN,FRANCE,RUSSIA,CHINA,NKOREA. ONLY JSON: [{"a":"CODE","t":"CODE","h":"headline 90 chars","tp":"military|nuclear|cyber|intel","sv":1-10,"d":"' + today + '","url":"https://source.com/article"}]' }]
      })
    });
    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    return res.status(200).json(await r.json());
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}