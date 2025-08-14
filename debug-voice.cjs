// 直接測試語音API的Node.js腳本
const axios = require('axios');
const fs = require('fs');

async function testVoiceAPI() {
  console.log('🔊 開始測試語音API...');
  
  const testData = {
    text: '這是一個測試語音',
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.5,
      use_speaker_boost: true
    }
  };
  
  try {
    console.log('📤 發送請求到本地API...');
    const response = await axios.post(
      'http://localhost:3001/api/elevenlabs/text-to-speech/hkfHEbBvdQFNX4uWHqRF',
      testData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        responseType: 'arraybuffer'
      }
    );
    
    console.log('✅ 請求成功！');
    console.log('響應狀態:', response.status);
    console.log('響應頭:', response.headers);
    console.log('數據大小:', response.data.byteLength, 'bytes');
    
    if (response.data.byteLength === 0) {
      console.log('❌ 收到空的音頻數據！');
      return;
    }
    
    // 檢查音頻文件頭
    const uint8Array = new Uint8Array(response.data);
    const header = Array.from(uint8Array.slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join(' ');
    console.log('音頻文件頭:', header);
    
    // 保存文件
    fs.writeFileSync('debug_audio.mp3', Buffer.from(response.data));
    console.log('✅ 音頻文件已保存為 debug_audio.mp3');
    
    // 模擬前端的blob處理
    const blob = new Blob([response.data], { type: 'audio/mpeg' });
    console.log('Blob大小:', blob.size);
    console.log('Blob類型:', blob.type);
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    if (error.response) {
      console.error('響應狀態:', error.response.status);
      console.error('響應數據:', error.response.data);
    }
  }
}

// 模擬前端的axios請求
async function testFrontendStyle() {
  console.log('\n🌐 測試前端風格的請求...');
  
  try {
    const response = await axios.post(
      'http://localhost:3001/api/elevenlabs/text-to-speech/hkfHEbBvdQFNX4uWHqRF',
      {
        text: '前端測試語音',
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
          pitch: 1.0,
          speed: 1.0
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json'
        },
        responseType: 'blob',
        timeout: 30000,
        validateStatus: (status) => status < 500
      }
    );
    
    console.log('✅ 前端風格請求成功！');
    console.log('響應狀態:', response.status);
    console.log('響應數據類型:', typeof response.data);
    console.log('響應數據:', response.data);
    
    if (response.data && response.data.size !== undefined) {
      console.log('Blob大小:', response.data.size);
      console.log('Blob類型:', response.data.type);
      
      if (response.data.size === 0) {
        console.log('❌ 前端風格請求收到空的音頻數據！');
      } else {
        console.log('✅ 前端風格請求收到有效的音頻數據');
      }
    }
    
  } catch (error) {
    console.error('❌ 前端風格測試失敗:', error.message);
    if (error.response) {
      console.error('響應狀態:', error.response.status);
      console.error('響應數據:', error.response.data);
    }
  }
}

// 運行測試
testVoiceAPI().then(() => {
  return testFrontendStyle();
}).then(() => {
  console.log('\n🏁 測試完成');
}).catch(error => {
  console.error('測試過程中發生錯誤:', error);
});