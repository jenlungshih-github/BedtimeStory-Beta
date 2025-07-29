const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Voices API endpoint
app.get('/api/elevenlabs/voices', async (req, res) => {
  console.log('🎤 Voices API called');
  console.log('API Key present:', !!process.env.ELEVENLABS_API_KEY);
  
  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(500).json({ 
      error: 'ELEVENLABS_API_KEY environment variable is missing',
      message: 'Please add your ElevenLabs API key to the .env file'
    });
  }

  try {
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'Accept': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      }
    });

    console.log('✅ Voices fetched successfully:', response.data.voices?.length || 0, 'voices');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ Error fetching voices:', error.response?.data || error.message);
    if (error.response) {
      res.status(error.response.status).json({ 
        error: `ElevenLabs API error: ${error.response.status}`,
        details: error.response.data
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch voices' });
    }
  }
});

// Text-to-speech API endpoint
app.post('/api/elevenlabs/text-to-speech/:voiceId', async (req, res) => {
  const { voiceId } = req.params;
  const { text, model_id, voice_settings } = req.body;

  console.log('🔊 Text-to-speech API called');
  console.log('Voice ID:', voiceId);
  console.log('Text length:', text?.length || 0);
  console.log('API Key present:', !!process.env.ELEVENLABS_API_KEY);

  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(500).json({ 
      error: 'ELEVENLABS_API_KEY environment variable is missing',
      message: 'Please add your ElevenLabs API key to the .env file'
    });
  }

  if (!voiceId || !text) {
    return res.status(400).json({ error: 'Voice ID and text are required' });
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

    console.log('✅ Audio generated successfully, size:', response.data.byteLength, 'bytes');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', response.data.byteLength);
    res.status(200).send(Buffer.from(response.data));
  } catch (error) {
    console.error('❌ Error generating speech:', error.response?.data || error.message);
    if (error.response) {
      res.status(error.response.status).json({ 
        error: `ElevenLabs API error: ${error.response.status}`,
        details: error.response.data
      });
    } else {
      res.status(500).json({ error: 'Failed to generate speech' });
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.ELEVENLABS_API_KEY
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🎤 Voices API: http://localhost:${PORT}/api/elevenlabs/voices`);
  console.log(`🔊 TTS API: http://localhost:${PORT}/api/elevenlabs/text-to-speech/{voiceId}`);
  console.log(`🔑 API Key configured: ${!!process.env.ELEVENLABS_API_KEY}`);
  
  if (!process.env.ELEVENLABS_API_KEY) {
    console.log('⚠️  WARNING: ELEVENLABS_API_KEY not found in .env file');
    console.log('   Please add your API key to .env file to test voice functionality');
  }
});