import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Volume2, Smartphone, Wifi, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { generateSpeech } from '../services/storyService'
import { logMobileInfo, testAudioSupport, createMobileAudio, logAudioError, isIOS, isMobile } from '../utils/mobileDebug'
import { usePopup } from '../contexts/PopupContext'

const testTexts = [
  '你好，這是語音測試。',
  '小兔子在森林裡快樂地跳躍。',
  'Hello, this is a voice test.'
]

export default function MobileVoiceTest() {
  const { showToast } = usePopup()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [testResults, setTestResults] = useState<any>(null)
  const [mobileInfo, setMobileInfo] = useState<any>(null)
  const [errorLogs, setErrorLogs] = useState<string[]>([])
  const [selectedText, setSelectedText] = useState(testTexts[0])
  const [audioSupport, setAudioSupport] = useState<any>(null)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const [dummyAudio, setDummyAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Log mobile info on component mount
    const info = logMobileInfo()
    setMobileInfo(info)
    
    // Test audio support
    testAudioSupport().then(setAudioSupport)
  }, [])

  const addErrorLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    setErrorLogs(prev => [...prev, logMessage])
    console.log('📱 Mobile Voice Test:', logMessage)
  }

  // Helper function to create silent audio using Web Audio API
  const createSilentAudioBuffer = async (): Promise<Blob> => {
    try {
      // Try Web Audio API first (most compatible)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContextClass) {
        const audioContext = new AudioContextClass()
        const sampleRate = audioContext.sampleRate || 44100
        const duration = 0.1 // 100ms of silence
        const frameCount = sampleRate * duration
        
        const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate)
        const channelData = audioBuffer.getChannelData(0)
        // Fill with silence (already zeros by default)
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = 0
        }
        
        // Convert to WAV blob
        const wavBlob = audioBufferToWav(audioBuffer)
        audioContext.close()
        return wavBlob
      }
    } catch (error) {
      addErrorLog(`⚠️ Web Audio API創建失敗: ${error}`)
    }
    
    // Fallback: Create minimal MP3 silence (more compatible than WAV)
    const silentMp3 = new Uint8Array([
      0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ])
    return new Blob([silentMp3], { type: 'audio/mpeg' })
  }
  
  // Helper function to convert AudioBuffer to WAV
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const length = buffer.length
    const arrayBuffer = new ArrayBuffer(44 + length * 2)
    const view = new DataView(arrayBuffer)
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
    
    writeString(0, 'RIFF')
    view.setUint32(4, 36 + length * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, buffer.sampleRate, true)
    view.setUint32(28, buffer.sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, length * 2, true)
    
    // Convert float samples to 16-bit PCM
    const channelData = buffer.getChannelData(0)
    let offset = 44
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }

  const initializeAudio = async () => {
    addErrorLog('🎯 初始化音頻上下文...')
    addErrorLog(`🌐 用戶代理: ${navigator.userAgent}`)
    addErrorLog(`📱 設備類型: ${isMobile() ? '移動設備' : '桌面設備'}`)
    addErrorLog(`🍎 iOS設備: ${isIOS() ? '是' : '否'}`)
    addErrorLog(`🔊 音頻上下文狀態: ${typeof AudioContext !== 'undefined' ? 'supported' : 'not supported'}`)
    addErrorLog(`🎵 HTML5音頻支持: ${typeof Audio !== 'undefined' ? 'supported' : 'not supported'}`)
    addErrorLog(`🌍 在線狀態: ${navigator.onLine ? '在線' : '離線'}`)
    
    try {
      // Create a dummy audio element and attempt to play it
      // This establishes the user gesture context for future audio operations
      const audio = new Audio()
      addErrorLog('✅ 音頻元素創建成功')
      
      // Create compatible silent audio using multiple fallback methods
      addErrorLog('🎵 創建兼容的靜音音頻...')
      let silentAudioUrl: string
      
      try {
        // Method 1: Use Web Audio API to create silent audio
        const silentBlob = await createSilentAudioBuffer()
        silentAudioUrl = URL.createObjectURL(silentBlob)
        addErrorLog(`✅ 使用Web Audio API創建靜音音頻: ${silentBlob.type}, ${silentBlob.size} bytes`)
      } catch (webAudioError) {
        addErrorLog(`⚠️ Web Audio API方法失敗: ${webAudioError}`)
        
        // Method 2: Fallback to minimal MP3 data URL
        try {
          silentAudioUrl = 'data:audio/mpeg;base64,/+MYxAAEaAIEeUAQAgBgNgP/////KQQ+B4BXiIuMjPX/7+b/9/7+//t/+vf7v/7+//7/+/v7+/v7+/v7+/v7+/v7+/v7'
          addErrorLog('✅ 使用MP3數據URL作為回退方案')
        } catch (mp3Error) {
          addErrorLog(`⚠️ MP3回退方案失敗: ${mp3Error}`)
          
          // Method 3: Last resort - try OGG format
          silentAudioUrl = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeKCj3//////////5ADdm9yYmlzLQAAAQV2b3JiaXMrQkNWAQAIAAAAMUwgTGF2ZjU4Ljc2LjEwMAEAAAAYAAAAZW5jb2Rlcj1MYXZjNTguMTM0LjEwMCB2b3JiaXMBBXZvcmJpcw=='
          addErrorLog('✅ 使用OGG數據URL作為最後回退方案')
        }
      }
      
      try {
        audio.src = silentAudioUrl
        addErrorLog('✅ 音頻源設置成功')
      } catch (srcError: any) {
        addErrorLog(`❌ 音頻源設置失敗: ${srcError.message}`)
        throw new Error(`無法設置音頻源: ${srcError.message}`)
      }
      
      audio.volume = 0.01 // Very low volume
      audio.muted = true // Start muted
      audio.preload = 'auto'
      addErrorLog(`🔊 音頻設置: 音量=${audio.volume}, 靜音=${audio.muted}, 預加載=${audio.preload}`)
      
      if (isMobile()) {
        audio.setAttribute('playsinline', 'true')
        audio.setAttribute('webkit-playsinline', 'true')
        addErrorLog('📱 應用移動端音頻優化')
      }
      
      if (isIOS()) {
        // Additional iOS optimizations
        audio.setAttribute('controls', 'false')
        ;(audio as any).webkitPreservesPitch = false
        addErrorLog('🍎 應用iOS特定優化')
      }
      
      // Wait for audio to be ready
      addErrorLog('⏳ 等待音頻加載完成...')
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          addErrorLog('❌ 音頻加載超時 (5秒)')
          addErrorLog(`📊 超時時網絡狀態: ${audio.networkState}`)
          addErrorLog(`📊 超時時準備狀態: ${audio.readyState}`)
          addErrorLog(`🎵 超時時音頻源: ${audio.src}`)
          reject(new Error('音頻加載超時'))
        }, 5000)
        
        const onCanPlay = () => {
          clearTimeout(timeout)
          audio.removeEventListener('canplay', onCanPlay)
          audio.removeEventListener('error', onError)
          addErrorLog('✅ 音頻可以播放 (canplay事件觸發)')
          addErrorLog(`📊 準備狀態: ${audio.readyState}`)
          addErrorLog(`⏱️ 音頻時長: ${audio.duration || 'unknown'}s`)
          resolve(void 0)
        }
        
        const onError = (e: any) => {
          clearTimeout(timeout)
          audio.removeEventListener('canplay', onCanPlay)
          audio.removeEventListener('error', onError)
          
          // Extract detailed error information
          let errorMessage = 'Unknown error'
          let errorCode = 'UNKNOWN'
          let errorDetails = ''
          
          if (e && e.target && e.target.error) {
            const mediaError = e.target.error
            errorCode = `MEDIA_ERR_${mediaError.code}`
            
            switch (mediaError.code) {
              case MediaError.MEDIA_ERR_ABORTED:
                errorMessage = '音頻加載被中止'
                errorCode = 'MEDIA_ERR_ABORTED'
                errorDetails = '用戶中止了音頻加載過程'
                break
              case MediaError.MEDIA_ERR_NETWORK:
                errorMessage = '網絡錯誤導致音頻加載失敗'
                errorCode = 'MEDIA_ERR_NETWORK'
                errorDetails = '請檢查網絡連接'
                break
              case MediaError.MEDIA_ERR_DECODE:
                errorMessage = '音頻解碼錯誤'
                errorCode = 'MEDIA_ERR_DECODE'
                errorDetails = '音頻格式可能不受支持'
                break
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = '音頻格式不受支持'
                errorCode = 'MEDIA_ERR_SRC_NOT_SUPPORTED'
                errorDetails = '當前設備不支持此音頻格式'
                break
              default:
                errorMessage = `媒體錯誤 (代碼: ${mediaError.code})`
                errorDetails = mediaError.message || '未知媒體錯誤'
            }
          } else if (e && typeof e === 'object' && 'message' in e) {
              const error = e as unknown as Error
              errorMessage = error.message || 'Unknown error'
              errorCode = error.name || 'JS_ERROR'
              errorDetails = error.stack ? error.stack.split('\n')[0] : ''
            } else if (e && typeof e === 'string') {
              errorMessage = e
              errorCode = 'STRING_ERROR'
            } else if (e && typeof e === 'object' && 'type' in e) {
              const event = e as Event
              errorMessage = `事件錯誤: ${event.type}`
              errorCode = event.type.toUpperCase()
              errorDetails = `事件目標: ${event.target ? (event.target as any).constructor.name : 'unknown'}`
            }
          
          addErrorLog(`❌ 音頻加載錯誤: ${errorMessage}`)
          addErrorLog(`🔍 錯誤代碼: ${errorCode}`)
          if (errorDetails) {
            addErrorLog(`📋 錯誤詳情: ${errorDetails}`)
          }
          addErrorLog(`🌐 音頻源: ${audio.src || 'not set'}`)
          addErrorLog(`📱 設備信息: ${navigator.userAgent.substring(0, 100)}...`)
          
          reject(new Error(`音頻加載失敗: ${errorMessage} (${errorCode})`))
        }
        
        audio.addEventListener('canplay', onCanPlay)
        audio.addEventListener('error', onError)
        
        // Load the audio
        audio.load()
      })
      
      addErrorLog('✅ 音頻元素準備就緒')
      
      // Attempt to play the silent audio
      addErrorLog('🎯 嘗試播放靜音音頻以建立用戶手勢上下文...')
      try {
        const playPromise = audio.play()
        addErrorLog(`🔄 播放Promise狀態: ${playPromise ? 'Promise返回' : '同步播放'}`)
        
        if (playPromise !== undefined) {
          await playPromise
          addErrorLog('✅ 靜音音頻播放成功')
          addErrorLog(`⏱️ 播放位置: ${audio.currentTime}s`)
          addErrorLog(`🔊 實際音量: ${audio.volume}, 實際靜音: ${audio.muted}`)
        } else {
          addErrorLog('✅ 同步播放完成')
        }
        
        // Immediately pause and reset
        audio.pause()
        audio.currentTime = 0
        addErrorLog('⏸️ 靜音音頻已暫停並重置')
        
      } catch (playError: any) {
        addErrorLog(`⚠️ 靜音播放失敗: ${playError.message}`)
        addErrorLog(`🔍 播放錯誤類型: ${playError.name}`)
        addErrorLog(`📊 播放失敗時網絡狀態: ${audio.networkState}`)
        addErrorLog(`📊 播放失敗時準備狀態: ${audio.readyState}`)
        
        // Don't throw error here, as the audio context might still be usable
        if (playError.name === 'NotAllowedError') {
          addErrorLog('ℹ️ 自動播放被阻止，但音頻上下文可能仍可用')
        } else if (playError.name === 'NotSupportedError') {
          addErrorLog('⚠️ 音頻格式不支持，但繼續嘗試初始化')
        } else if (playError.name === 'AbortError') {
          addErrorLog('⚠️ 播放被中止，但繼續嘗試初始化')
        } else {
          addErrorLog(`⚠️ 未知播放錯誤: ${playError.name || 'Unknown'}`)
        }
      }
      
      setDummyAudio(audio)
      setAudioInitialized(true)
      addErrorLog('✅ 音頻上下文初始化完成')
      showToast('success', '音頻已初始化，現在可以測試語音功能！')
      
    } catch (error: any) {
      addErrorLog(`❌ 音頻初始化失敗: ${error.message}`)
      if (error.name === 'NotAllowedError') {
        showToast('error', '音頻初始化失敗：瀏覽器阻止了音頻播放')
        addErrorLog('💡 請在用戶手勢中重新嘗試初始化')
      } else if (error.message?.includes('超時')) {
        showToast('error', '音頻初始化超時，請重試')
        addErrorLog('💡 網絡可能較慢，請稍後重試')
      } else {
        showToast('error', `音頻初始化失敗: ${error.message}`)
        addErrorLog('💡 請檢查設備音頻支持或重新加載頁面')
      }
    }
  }

  const testVoiceGeneration = async () => {
    if (!audioInitialized || !dummyAudio) {
      showToast('error', '請先點擊「初始化音頻」按鈕')
      addErrorLog('❌ 音頻未初始化，請先初始化音頻上下文')
      return
    }
    
    if (isPlaying) {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
        setCurrentAudio(null)
      }
      setIsPlaying(false)
      addErrorLog('⏹️ 停止當前播放')
      return
    }

    setIsPlaying(true)
    addErrorLog('🎯 開始語音生成測試...')
    addErrorLog(`📝 測試文本: "${selectedText}"`)
    addErrorLog(`🌐 當前環境: ${window.location.origin}`)
    addErrorLog(`📱 設備類型: ${isMobile() ? '移動設備' : '桌面設備'}`)
    addErrorLog(`🍎 iOS設備: ${isIOS() ? '是' : '否'}`)
    
    // Reuse the initialized audio element to preserve user gesture context
    const audio = dummyAudio
    addErrorLog('🔄 重用已初始化的音頻元素，保持用戶手勢上下文')
    
    // Reset audio element state
    audio.pause()
    audio.currentTime = 0
    audio.volume = 1.0
    audio.muted = false // Unmute the audio for speech playback
    
    // Verify audio element is still usable
    addErrorLog('🔍 驗證音頻元素狀態...')
    addErrorLog(`📊 當前網絡狀態: ${audio.networkState} (0=EMPTY, 1=IDLE, 2=LOADING, 3=NO_SOURCE)`)
    addErrorLog(`📊 當前準備狀態: ${audio.readyState} (0=NOTHING, 1=METADATA, 2=CURRENT_DATA, 3=FUTURE_DATA, 4=ENOUGH_DATA)`)
    addErrorLog(`🎵 當前音頻源: ${audio.src || 'none'}`)
    
    // Clear any existing source to ensure clean state
    if (audio.src) {
      addErrorLog('🧹 清理舊的音頻源')
      audio.removeAttribute('src')
      audio.load() // Reset the audio element
    }
    
    // Ensure mobile optimizations are still applied
    if (isMobile()) {
      addErrorLog('📱 確認移動端優化已應用')
      if (isIOS()) {
        addErrorLog('🍎 確認iOS特定優化已應用')
      }
    }
    
    try {
      // Step 1: Network connectivity check
      if (!navigator.onLine) {
        throw new Error('設備離線，請檢查網絡連接')
      }
      addErrorLog('✅ 網絡連接正常')
      
      // Step 2: Call speech generation API
      addErrorLog('📡 調用語音生成API...')
      const startTime = Date.now()
      
      const audioBlob = await generateSpeech(
        selectedText,
        'hkfHEbBvdQFNX4uWHqRF', // Stacy voice
        1.0, // pitch
        1.0  // speed
      )
      
      const requestTime = Date.now() - startTime
      addErrorLog(`✅ API調用完成，耗時: ${requestTime}ms`)
      addErrorLog(`📊 音頻數據大小: ${audioBlob.size} bytes`)
      addErrorLog(`📊 音頻類型: ${audioBlob.type}`)
      
      // Step 3: Validate audio data
      if (audioBlob.size === 0) {
        throw new Error('收到空的音頻數據')
      }
      
      if (audioBlob.size < 1000) {
        addErrorLog(`⚠️ 音頻數據較小: ${audioBlob.size} bytes，可能存在問題`)
      }
      
      // Check audio blob header for format validation
      const arrayBuffer = await audioBlob.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const header = Array.from(uint8Array.slice(0, 4))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ')
      addErrorLog(`🔍 音頻文件頭: ${header}`)
      
      // Create audio URL
      let audioUrl: string
      try {
        audioUrl = URL.createObjectURL(audioBlob)
        addErrorLog(`✅ 音頻URL創建成功: ${audioUrl.substring(0, 50)}...`)
      } catch (urlError) {
        addErrorLog(`❌ 音頻URL創建失敗: ${urlError}`)
        throw new Error(`無法創建音頻URL: ${urlError}`)
      }
      
      // Step 4: Set up event listeners
      audio.onloadstart = () => addErrorLog('🔄 開始加載音頻')
      audio.onloadedmetadata = () => addErrorLog(`✅ 音頻元數據加載完成，時長: ${audio.duration}s`)
      audio.oncanplay = () => addErrorLog('✅ 音頻可以開始播放')
      audio.oncanplaythrough = () => addErrorLog('✅ 音頻可以完整播放')
      audio.onplay = () => addErrorLog('▶️ 音頻開始播放')
      audio.onpause = () => addErrorLog('⏸️ 音頻暫停')
      audio.onended = () => {
        addErrorLog('✅ 音頻播放完成')
        setIsPlaying(false)
        setCurrentAudio(null)
        // Clean up the blob URL
        if (audioUrl && audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl)
          addErrorLog('🧹 清理音頻URL資源')
        }
      }
      
      audio.onerror = (e) => {
        // Extract detailed error information for playback errors
        let errorMessage = 'Unknown playback error'
        let errorCode = 'UNKNOWN'
        let errorDetails = ''
        
        if (e && typeof e === 'object' && 'target' in e && e.target && (e.target as any).error) {
          const mediaError = (e.target as any).error
          errorCode = `MEDIA_ERR_${mediaError.code}`
          
          switch (mediaError.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = '音頻播放被中止'
              errorCode = 'MEDIA_ERR_ABORTED'
              errorDetails = '播放過程被用戶或系統中止'
              break
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = '網絡錯誤導致播放失敗'
              errorCode = 'MEDIA_ERR_NETWORK'
              errorDetails = '音頻數據傳輸中斷'
              break
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = '音頻解碼失敗'
              errorCode = 'MEDIA_ERR_DECODE'
              errorDetails = '音頻數據損壞或格式錯誤'
              break
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = '音頻源不受支持'
              errorCode = 'MEDIA_ERR_SRC_NOT_SUPPORTED'
              errorDetails = '設備不支持此音頻格式或編碼'
              break
            default:
              errorMessage = `媒體播放錯誤 (代碼: ${mediaError.code})`
              errorDetails = mediaError.message || '未知播放錯誤'
          }
        } else if (e && typeof e === 'object' && 'message' in e) {
            const error = e as unknown as Error
            errorMessage = error.message || 'Unknown error'
            errorCode = error.name || 'JS_ERROR'
            errorDetails = error.stack ? error.stack.split('\n')[0] : ''
          } else if (e && typeof e === 'string') {
            errorMessage = e
            errorCode = 'STRING_ERROR'
          } else if (e && typeof e === 'object' && 'type' in e) {
            const event = e as Event
            errorMessage = `播放事件錯誤: ${event.type}`
            errorCode = event.type.toUpperCase()
            errorDetails = `事件目標: ${event.target ? (event.target as any).constructor.name : 'unknown'}`
          }
        
        addErrorLog(`❌ 音頻播放錯誤: ${errorMessage}`)
        addErrorLog(`🔍 錯誤代碼: ${errorCode}`)
        if (errorDetails) {
          addErrorLog(`📋 錯誤詳情: ${errorDetails}`)
        }
        addErrorLog(`🎵 當前音頻源: ${audio.src || 'not set'}`)
        addErrorLog(`⏱️ 播放位置: ${audio.currentTime}s / ${audio.duration || 'unknown'}s`)
        addErrorLog(`🔊 音量: ${audio.volume}, 靜音: ${audio.muted}`)
        
        setIsPlaying(false)
        setCurrentAudio(null)
        // Clean up the blob URL
        if (audioUrl && audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl)
          addErrorLog('🧹 清理音頻URL資源')
        }
        showToast('error', `音頻播放失敗: ${errorMessage}`)
      }
      
      audio.onstalled = () => addErrorLog('⚠️ 音頻加載停滯')
      audio.onsuspend = () => addErrorLog('⚠️ 音頻加載暫停')
      audio.onwaiting = () => addErrorLog('⚠️ 音頻等待數據')
      
      // Step 5: Set src and load
      try {
        audio.src = audioUrl
        addErrorLog(`🔗 設置音頻源: ${audioUrl.substring(0, 50)}...`)
        
        // Force load the audio
        audio.load()
        
        setCurrentAudio(audio)
        addErrorLog('✅ 音頻元素設置完成')
        
      } catch (srcError: any) {
        addErrorLog(`❌ 設置音頻源失敗: ${srcError.message}`)
        throw new Error(`無法設置音頻源: ${srcError.message}`)
      }
      
      // Step 6: Wait for audio to be ready
      addErrorLog('⏳ 等待音頻準備就緒...')
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          addErrorLog('❌ 音頻加載超時 (15秒)')
          reject(new Error('音頻加載超時，請檢查網絡連接'))
        }, 15000) // Increased timeout for mobile networks
        
        const onCanPlay = () => {
          clearTimeout(timeout)
          audio.removeEventListener('canplay', onCanPlay)
          audio.removeEventListener('error', onError)
          audio.removeEventListener('loadstart', onLoadStart)
          audio.removeEventListener('loadeddata', onLoadedData)
          addErrorLog('✅ 音頻準備就緒，可以播放')
          resolve(void 0)
        }
        
        const onError = (e: any) => {
          clearTimeout(timeout)
          audio.removeEventListener('canplay', onCanPlay)
          audio.removeEventListener('error', onError)
          audio.removeEventListener('loadstart', onLoadStart)
          audio.removeEventListener('loadeddata', onLoadedData)
          
          // Extract detailed error information for audio preparation
          let errorMessage = 'Unknown preparation error'
          let errorCode = 'UNKNOWN'
          let errorDetails = ''
          
          if (e && e.target && e.target.error) {
            const mediaError = e.target.error
            errorCode = `MEDIA_ERR_${mediaError.code}`
            
            switch (mediaError.code) {
              case MediaError.MEDIA_ERR_ABORTED:
                errorMessage = '音頻準備被中止'
                errorCode = 'MEDIA_ERR_ABORTED'
                errorDetails = '音頻加載過程被中止'
                break
              case MediaError.MEDIA_ERR_NETWORK:
                errorMessage = '網絡錯誤影響音頻準備'
                errorCode = 'MEDIA_ERR_NETWORK'
                errorDetails = '無法從服務器獲取音頻數據'
                break
              case MediaError.MEDIA_ERR_DECODE:
                errorMessage = '音頻數據解碼失敗'
                errorCode = 'MEDIA_ERR_DECODE'
                errorDetails = '音頻文件格式錯誤或損壞'
                break
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = '音頻格式不被支持'
                errorCode = 'MEDIA_ERR_SRC_NOT_SUPPORTED'
                errorDetails = '當前瀏覽器不支持此音頻格式'
                break
              default:
                errorMessage = `媒體準備錯誤 (代碼: ${mediaError.code})`
                errorDetails = mediaError.message || '未知媒體錯誤'
            }
          } else if (e && typeof e === 'object' && 'message' in e) {
              const error = e as unknown as Error
              errorMessage = error.message || 'Unknown error'
              errorCode = error.name || 'JS_ERROR'
              errorDetails = error.stack ? error.stack.split('\n')[0] : ''
            } else if (e && typeof e === 'string') {
              errorMessage = e
              errorCode = 'STRING_ERROR'
            } else if (e && typeof e === 'object' && 'type' in e) {
              const event = e as Event
              errorMessage = `準備事件錯誤: ${event.type}`
              errorCode = event.type.toUpperCase()
              errorDetails = `事件目標: ${event.target ? (event.target as any).constructor.name : 'unknown'}`
            }
          
          addErrorLog(`❌ 音頻準備失敗: ${errorMessage}`)
          addErrorLog(`🔍 錯誤代碼: ${errorCode}`)
          if (errorDetails) {
            addErrorLog(`📋 錯誤詳情: ${errorDetails}`)
          }
          addErrorLog(`🎵 音頻源狀態: ${audio.src || 'not set'}`)
          addErrorLog(`📊 網絡狀態: ${audio.networkState} (0=EMPTY, 1=IDLE, 2=LOADING, 3=NO_SOURCE)`)
          addErrorLog(`📊 準備狀態: ${audio.readyState} (0=NOTHING, 1=METADATA, 2=CURRENT_DATA, 3=FUTURE_DATA, 4=ENOUGH_DATA)`)
          
          reject(new Error(`音頻準備失敗: ${errorMessage} (${errorCode})`))
        }
        
        const onLoadStart = () => {
          addErrorLog('🔄 開始加載音頻數據')
        }
        
        const onLoadedData = () => {
          addErrorLog('📊 音頻數據加載完成')
        }
        
        audio.addEventListener('canplay', onCanPlay)
        audio.addEventListener('error', onError)
        audio.addEventListener('loadstart', onLoadStart)
        audio.addEventListener('loadeddata', onLoadedData)
      })
      
      // Step 7: Start playing the audio
      addErrorLog('🎯 開始播放音頻...')
      try {
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          await playPromise
          addErrorLog('✅ 音頻播放成功')
        } else {
          addErrorLog('✅ 同步播放完成')
        }
        
        showToast('success', '語音播放成功！')
        
      } catch (playError: any) {
        const errorInfo = logAudioError(playError, 'Audio play() method error')
        addErrorLog(`❌ 播放失敗: ${errorInfo.name} - ${errorInfo.message}`)
        
        setIsPlaying(false)
        setCurrentAudio(null)
        
        if (playError.name === 'NotAllowedError') {
          showToast('error', '播放被阻止，請重新初始化音頻')
          addErrorLog('ℹ️ NotAllowedError: 播放被阻止')
          addErrorLog('💡 解決方案: 重新初始化音頻上下文')
          setAudioInitialized(false) // Reset audio initialization
        } else if (playError.name === 'NotSupportedError') {
          showToast('error', '音頻格式不支持')
          addErrorLog('ℹ️ NotSupportedError: 音頻格式不支持')
          addErrorLog('💡 嘗試使用不同的瀏覽器或更新當前瀏覽器')
        } else if (playError.name === 'AbortError') {
          showToast('error', '音頻播放被中斷')
          addErrorLog('ℹ️ AbortError: 音頻播放被中斷')
        } else {
          showToast('error', `播放失敗: ${playError.message}`)
          addErrorLog(`💡 播放錯誤詳情: ${playError.name} - ${playError.message}`)
        }
        
        // Clean up the blob URL
        if (audioUrl && audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl)
          addErrorLog('🧹 清理音頻URL資源')
        }
        return
      }
      
    } catch (error: any) {
      setIsPlaying(false)
      setCurrentAudio(null)
      
      addErrorLog(`❌ 語音生成失敗: ${error.message}`)
      
      // Enhanced error analysis
      if (error.response) {
        addErrorLog(`HTTP狀態碼: ${error.response.status}`)
        addErrorLog(`響應數據: ${JSON.stringify(error.response.data).substring(0, 200)}`)
        
        // Provide specific guidance based on status code
        if (error.response.status === 401) {
          addErrorLog('💡 API密鑰無效，請檢查環境變量設置')
        } else if (error.response.status === 429) {
          addErrorLog('💡 API請求過於頻繁，請稍後再試')
        } else if (error.response.status >= 500) {
          addErrorLog('💡 服務器錯誤，請稍後重試')
        }
      }
      
      if (error.code) {
        addErrorLog(`錯誤代碼: ${error.code}`)
        
        if (error.code === 'NETWORK_ERROR') {
          addErrorLog('💡 網絡連接問題，請檢查網絡設置')
        } else if (error.code === 'TIMEOUT') {
          addErrorLog('💡 請求超時，請檢查網絡速度')
        }
      }
      
      if (error.config) {
        addErrorLog(`請求URL: ${error.config.url}`)
        addErrorLog(`請求方法: ${error.config.method}`)
        addErrorLog(`超時設置: ${error.config.timeout}ms`)
      }
      
      // Clean up any created audio URL
      if (currentAudio && currentAudio.src && currentAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(currentAudio.src)
        addErrorLog('🧹 清理音頻資源')
      }
      
      showToast('error', `語音生成失敗: ${error.message}`)
    }
  }

  const clearLogs = () => {
    setErrorLogs([])
    addErrorLog('日誌已清空')
  }

  const resetAudio = () => {
    setAudioInitialized(false)
    
    // Clean up dummy audio
    if (dummyAudio) {
      dummyAudio.pause()
      if (dummyAudio.src && dummyAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(dummyAudio.src)
        addErrorLog('🧹 清理靜音音頻blob URL')
      }
      dummyAudio.src = ''
    }
    setDummyAudio(null)
    
    // Clean up current audio
    if (currentAudio) {
      currentAudio.pause()
      if (currentAudio.src && currentAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(currentAudio.src)
      }
      setCurrentAudio(null)
    }
    
    setIsPlaying(false)
    addErrorLog('🔄 音頻狀態已重置，所有資源已清理')
    showToast('info', '音頻狀態已重置，請重新初始化')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-700">移動端語音測試 📱</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Device Info */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            設備信息
          </h2>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>設備類型:</strong> {isMobile() ? '移動設備' : '桌面設備'}
              </div>
              <div>
                <strong>iOS設備:</strong> {isIOS() ? '是' : '否'}
              </div>
              <div>
                <strong>在線狀態:</strong> {navigator.onLine ? '在線' : '離線'}
              </div>
              <div>
                <strong>協議:</strong> {window.location.protocol}
              </div>
              <div className="md:col-span-2">
                <strong>User Agent:</strong> 
                <div className="text-xs text-gray-600 mt-1 break-all">
                  {navigator.userAgent}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Support Test */}
        {audioSupport && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              音頻支持測試
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>HTML5 Audio:</strong> {audioSupport.htmlAudio ? '✅ 支持' : '❌ 不支持'}
                </div>
                <div>
                  <strong>AudioContext:</strong> {audioSupport.audioContext ? '✅ 支持' : '❌ 不支持'}
                </div>
                <div>
                  <strong>自動播放:</strong> {audioSupport.autoplay ? '✅ 支持' : '❌ 不支持'}
                </div>
                <div>
                  <strong>MP3格式:</strong> {audioSupport.formats.mp3 ? '✅ 支持' : '❌ 不支持'}
                </div>
                <div>
                  <strong>WAV格式:</strong> {audioSupport.formats.wav ? '✅ 支持' : '❌ 不支持'}
                </div>
                <div>
                  <strong>M4A格式:</strong> {audioSupport.formats.m4a ? '✅ 支持' : '❌ 不支持'}
                </div>
              </div>
              {audioSupport.errors.length > 0 && (
                <div className="mt-4">
                  <strong className="text-red-600">檢測到的問題:</strong>
                  <ul className="text-xs text-red-600 mt-1">
                    {audioSupport.errors.map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                  <div className="mt-2 text-xs text-gray-600">
                    💡 這些問題可能會影響音頻播放，但不一定阻止功能正常工作
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Voice Test */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">語音測試</h2>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Text Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                選擇測試文本:
              </label>
              <select
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {testTexts.map((text, index) => (
                  <option key={index} value={text}>{text}</option>
                ))}
              </select>
            </div>

            {/* Audio Initialization */}
            {!audioInitialized && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">需要初始化音頻</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  由於瀏覽器的自動播放限制，需要先通過用戶交互來初始化音頻上下文。
                  請點擊下方按鈕來啟用音頻功能。
                </p>
                <button
                  onClick={initializeAudio}
                  className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  初始化音頻
                </button>
              </div>
            )}

            {/* Test Button */}
            <button
              onClick={testVoiceGeneration}
              disabled={!audioInitialized}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                !audioInitialized
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isPlaying
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {!audioInitialized ? (
                <>
                  <Volume2 className="w-5 h-5" />
                  請先初始化音頻
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  停止測試
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  開始語音測試
                </>
              )}
            </button>
            
            {audioInitialized && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700 font-medium">音頻已初始化，可以開始測試</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Error Logs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              測試日誌
            </h2>
            <div className="flex gap-2">
              <button
                onClick={resetAudio}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                重置音頻
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                清空日誌
              </button>
            </div>
          </div>
          <div className="bg-black rounded-2xl p-4 shadow-lg">
            <div className="text-green-400 font-mono text-xs max-h-96 overflow-y-auto">
              {errorLogs.length === 0 ? (
                <div className="text-gray-500">暫無日誌...</div>
              ) : (
                errorLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}