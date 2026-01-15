const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

if (!process.env.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY not set. Proxy will return 500 for requests requiring the key.');
}

app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, maxOutputTokens = 1024 } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server not configured with GEMINI_API_KEY' });
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens }
      })
    });

    const text = await response.text();

    // Forward status and body
    res.status(response.status).type('application/json').send(text);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: String(err) });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Gemini proxy listening on port ${port}`);
});
