const axios = require('axios');

module.exports = async function handler(req, res) {
  // Add CORS headers for mobile compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { voiceId } = req.query;
  const { text, model_id, voice_settings } = req.body;
  
  // Enhanced logging for debugging
  console.log('🔊 TTS API Request:', {
    voiceId,
    textLength: text?.length || 0,
    textPreview: text?.substring(0, 50) + (text?.length > 50 ? '...' : ''),
    model_id,
    voice_settings,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin
  });

  if (!voiceId || !text) {
    console.error('❌ Missing required parameters:', { voiceId: !!voiceId, text: !!text });
    return res.status(400).json({ error: 'Voice ID and text are required' });
  }

  // Check if API key is configured
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY not configured');
    return res.status(500).json({ 
      error: 'ELEVENLABS_API_KEY environment variable is not configured in Vercel. Please add it in your Vercel project settings.' 
    });
  }

  try {
    const startTime = Date.now();
    
    const requestData = {
      text,
      model_id: model_id || 'eleven_multilingual_v2',
      voice_settings: voice_settings || {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true
      }
    };
    
    console.log('📤 Sending request to ElevenLabs API...');
    
    const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, requestData, {
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
      maxContentLength: 50 * 1024 * 1024, // 50MB max
      maxBodyLength: 50 * 1024 * 1024
    });
    
    const requestTime = Date.now() - startTime;
    const audioSize = response.data.byteLength;
    
    console.log('✅ ElevenLabs API Response:', {
      status: response.status,
      audioSize,
      requestTime,
      contentType: response.headers['content-type']
    });
    
    // Validate audio data
    if (!response.data || audioSize === 0) {
      console.error('❌ Empty audio data received from ElevenLabs API');
      return res.status(500).json({ 
        error: 'Empty audio data received from ElevenLabs API',
        details: { audioSize, status: response.status }
      });
    }
    
    if (audioSize < 100) { // Audio files should be at least 100 bytes
      console.warn('⚠️ Suspiciously small audio file:', audioSize, 'bytes');
    }
    
    // Set proper headers for audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioSize);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Accept-Ranges', 'bytes');
    
    // Convert ArrayBuffer to Buffer and send
    const audioBuffer = Buffer.from(response.data);
    console.log('📤 Sending audio response, buffer size:', audioBuffer.length);
    
    res.status(200).send(audioBuffer);
    
  } catch (error) {
    const requestTime = Date.now() - (error.config?.metadata?.startTime || Date.now());
    
    console.error('❌ Error generating speech:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      requestTime,
      url: error.config?.url,
      method: error.config?.method
    });
    
    // Log response data if available
    if (error.response?.data) {
      console.error('ElevenLabs API Error Response:', error.response.data);
    }
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return res.status(408).json({ 
        error: 'Request timeout - please try again',
        code: 'TIMEOUT'
      });
    }
    
    if (error.response) {
      const status = error.response.status;
      let errorMessage = `ElevenLabs API error: ${status}`;
      
      switch (status) {
        case 401:
          errorMessage = 'Invalid API key - please check your ElevenLabs API key configuration';
          break;
        case 403:
          errorMessage = 'Access forbidden - please check your ElevenLabs API key permissions';
          break;
        case 422:
          errorMessage = 'Invalid request parameters - please check your text and voice settings';
          break;
        case 429:
          errorMessage = 'Rate limit exceeded - please try again later';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = 'ElevenLabs service temporarily unavailable - please try again later';
          break;
      }
      
      return res.status(status).json({ 
        error: errorMessage,
        code: 'ELEVENLABS_API_ERROR',
        details: error.response.data
      });
    } else {
      return res.status(500).json({ 
        error: 'Failed to generate speech - network or server error',
        code: 'NETWORK_ERROR',
        message: error.message
      });
    }
  }
}