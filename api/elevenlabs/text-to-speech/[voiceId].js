const axios = require('axios');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { voiceId } = req.query;
  const { text, model_id, voice_settings } = req.body;

  if (!voiceId || !text) {
    return res.status(400).json({ error: 'Voice ID and text are required' });
  }

  // Check if API key is configured
  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(500).json({ 
      error: 'ELEVENLABS_API_KEY environment variable is not configured in Vercel. Please add it in your Vercel project settings.' 
    });
  }

  try {
    const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      text,
      model_id: model_id || 'eleven_multilingual_v2',
      voice_settings: voice_settings || {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true
      }
    }, {
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      responseType: 'arraybuffer'
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', response.data.byteLength);
    res.status(200).send(Buffer.from(response.data));
  } catch (error) {
    console.error('Error generating speech:', error);
    if (error.response) {
      res.status(error.response.status).json({ error: `ElevenLabs API error: ${error.response.status}` });
    } else {
      res.status(500).json({ error: 'Failed to generate speech' });
    }
  }
}