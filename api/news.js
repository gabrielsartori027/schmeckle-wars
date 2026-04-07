export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
        messages: [{
          role: 'user',
          content: `You are a military intelligence analyst. Search the web RIGHT NOW for: "${query}"

CRITICAL: Today is ${today}. ONLY events from ${today} or ${yesterday}. ZERO tolerance for old news.

Find 2-4 CURRENT military events from the last 24 hours ONLY.

ACCEPT: Airstrikes, drone attacks, ground combat, missile launches, military casualties, naval confrontations, nuclear developments, weapons deployments — all from TODAY.

REJECT: Anything before ${yesterday}, political statements, speeches, diplomatic talks, "tensions", speculation, historical context.

Each headline: WHO + WHAT military action + WHERE + must be today/yesterday.

Codes: USA, ISRAEL, IRAN (Hamas/Hezbollah/Houthis), FRANCE (NATO), RUSSIA, CHINA, NKOREA

ONLY valid JSON:
[{"a":"ATTACKER","t":"TARGET","h":"specific current military action max 90 chars","tp":"military|nuclear|cyber|intel","sv":1-10,"d":"${today}","url":"https://source.com/article"}]

url = real article URL. Prefer reuters.com, apnews.com, bbc.com. JSON ONLY.`
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
