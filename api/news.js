export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key' });

  let body = req.body;
  if (typeof body === 'string') body = JSON.parse(body);
  const query = body?.query;
  if (!query) return res.status(400).json({ error: 'Missing query', body: typeof req.body });

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

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
        messages: [{
          role: 'user',
          content: 'You are a military intelligence analyst. Search the web RIGHT NOW for: "' + query + '"\n\nCRITICAL: Today is ' + today + '. ONLY events from ' + today + ' or ' + yesterday + '. ZERO tolerance for old news.\n\nFind 2-4 CURRENT military events from the last 24 hours ONLY.\n\nACCEPT: Airstrikes, drone attacks, ground combat, missile launches, military casualties, naval confrontations, nuclear developments, weapons deployments from TODAY.\n\nREJECT: Anything before ' + yesterday + ', political statements, speeches, diplomatic talks, tensions, speculation, historical context.\n\nEach headline: WHO + WHAT military action + WHERE + must be today/yesterday.\n\nCodes: USA, ISRAEL, IRAN (Hamas/Hezbollah/Houthis), FRANCE (NATO), RUSSIA, CHINA, NKOREA\n\nONLY valid JSON:\n[{"a":"ATTACKER","t":"TARGET","h":"specific current military action max 90 chars","tp":"military|nuclear|cyber|intel","sv":1-10,"d":"' + today + '","url":"https://source.com/article"}]\n\nurl = real article URL. Prefer reuters.com, apnews.com, bbc.com. JSON ONLY.'
        }]
      })
    });

    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}