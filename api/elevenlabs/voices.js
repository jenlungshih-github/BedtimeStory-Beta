const axios = require('axios');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'Accept': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching voices:', error);
    if (error.response) {
      res.status(error.response.status).json({ error: `ElevenLabs API error: ${error.response.status}` });
    } else {
      res.status(500).json({ error: 'Failed to fetch voices' });
    }
  }
}