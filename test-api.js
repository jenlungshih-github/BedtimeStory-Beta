const axios = require('axios');

// Test the voices API endpoint
async function testVoicesAPI() {
  try {
    console.log('Testing voices API...');
    const response = await axios.get('http://localhost:3000/api/elevenlabs/voices');
    console.log('✅ Voices API working:', response.status);
    console.log('Number of voices:', response.data.voices?.length || 0);
  } catch (error) {
    console.log('❌ Voices API failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

// Test the text-to-speech API endpoint
async function testTTSAPI() {
  try {
    console.log('\nTesting text-to-speech API...');
    const response = await axios.post('http://localhost:3000/api/elevenlabs/text-to-speech/hkfHEbBvdQFNX4uWHqRF', {
      text: '測試語音生成',
      model_id: 'eleven_multilingual_v2'
    }, {
      responseType: 'arraybuffer'
    });
    console.log('✅ TTS API working:', response.status);
    console.log('Audio data size:', response.data.byteLength, 'bytes');
  } catch (error) {
    console.log('❌ TTS API failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Testing API endpoints locally...\n');
  await testVoicesAPI();
  await testTTSAPI();
  console.log('\n✨ Test completed!');
}

runTests().catch(console.error);