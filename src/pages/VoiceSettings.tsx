import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStoryStore } from '../store/storyStore'
import { getAvailableVoices, generateSpeech, getAvailableVoicesSync } from '../services/storyService'
import { ArrowLeft, Play, Volume2, Loader2, Smartphone, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { isIOS, isMobile, logMobileInfo, testAudioSupport } from '../utils/mobileDebug'
import { usePopup } from '../contexts/PopupContext'

const sampleText = '小兔子在森林裡遇到了一隻迷路的小鳥，決定幫助它找到回家的路。'

interface Voice {
  id: string
  name: string
  description: string
  category?: string
  labels?: Record<string, string>
  preview_url?: string
}

export default function VoiceSettings() {
  const { showToast } = usePopup()
  const { voiceSettings, setVoiceSettings } = useStoryStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [voices, setVoices] = useState<Voice[]>(getAvailableVoicesSync())
  const [isLoadingVoices, setIsLoadingVoices] = useState(true)
  
  // Fetch ElevenLabs voices on component mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setIsLoadingVoices(true)
        const elevenLabsVoices = await getAvailableVoices()
        setVoices(elevenLabsVoices)
        showToast('success', '已載入 ElevenLabs 語音選項')
      } catch (error) {
        console.error('Failed to fetch ElevenLabs voices:', error)
        showToast('error', '載入語音選項失敗，使用預設選項。如果是在 Vercel 部署，請檢查 ELEVENLABS_API_KEY 環境變數設定。')
        // Keep using fallback voices
      } finally {
        setIsLoadingVoices(false)
      }
    }
    
    fetchVoices()
  }, [])

  const handleVoiceChange = (voiceId: string) => {
    setVoiceSettings({ voice: voiceId })
  }

  const handlePitchChange = (pitch: number) => {
    setVoiceSettings({ pitch })
  }

  const handleSpeedChange = (speed: number) => {
    setVoiceSettings({ speed })
  }

  const playPreview = async () => {
    if (isPlaying && currentAudio) {
      currentAudio.pause()
      setIsPlaying(false)
      setCurrentAudio(null)
      return
    }

    setIsPlaying(true)
    
    // Log mobile info for debugging
    if (isMobile()) {
      console.log('📱 Mobile device detected, logging debug info:')
      logMobileInfo()
    }
    
    try {
      // Check network connectivity first
      if (!navigator.onLine) {
        throw new Error('設備離線，請檢查網絡連接')
      }
      
      const audioBlob = await generateSpeech(
        sampleText,
        voiceSettings.voice,
        voiceSettings.pitch,
        voiceSettings.speed
      )
      
      console.log(`✅ Audio blob generated successfully, size: ${audioBlob.size} bytes`)
      
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      // iOS optimizations
      audio.preload = 'metadata'
      audio.setAttribute('playsinline', 'true')
      audio.crossOrigin = 'anonymous'
      
      // Additional mobile optimizations
      if (isMobile()) {
        audio.load() // Preload on mobile
      }
      
      audio.onloadstart = () => console.log('🔄 Audio loading started')
      audio.onloadedmetadata = () => console.log(`✅ Audio metadata loaded, duration: ${audio.duration}s`)
      audio.oncanplay = () => console.log('✅ Audio can start playing')
      audio.oncanplaythrough = () => console.log('✅ Audio can play through')
      
      audio.onended = () => {
        console.log('✅ Audio playback ended')
        setIsPlaying(false)
        setCurrentAudio(null)
        URL.revokeObjectURL(audioUrl)
      }
      
      audio.onerror = (e) => {
        console.error('❌ Audio error:', e)
        setIsPlaying(false)
        setCurrentAudio(null)
        
        let errorMsg = '語音播放失敗'
        if (audio.error) {
          switch (audio.error.code) {
            case 1: errorMsg = '音頻加載被中止'; break
            case 2: errorMsg = '網絡錯誤'; break
            case 3: errorMsg = '音頻解碼失敗'; break
            case 4: errorMsg = '音頻格式不支持'; break
            default: errorMsg = `音頻錯誤 (代碼: ${audio.error.code})`
          }
        }
        
        showToast('error', errorMsg)
        URL.revokeObjectURL(audioUrl)
      }
      
      audio.onstalled = () => console.log('⚠️ Audio loading stalled')
      audio.onsuspend = () => console.log('⚠️ Audio loading suspended')
      audio.onwaiting = () => console.log('⚠️ Audio waiting for data')
      
      setCurrentAudio(audio)
      
      try {
        console.log('🎵 Attempting to play audio...')
        // iOS requires user gesture for audio playback
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          await playPromise
          console.log('✅ Audio playback started successfully')
        }
      } catch (playError: any) {
        console.error('❌ Audio play error:', playError)
        setIsPlaying(false)
        setCurrentAudio(null)
        
        let errorMessage = '音頻播放失敗'
        
        if (playError.name === 'NotAllowedError') {
          errorMessage = 'iOS需要用戶手勢才能播放音頻，請點擊播放按鈕'
          if (isIOS()) {
            showToast('error', 'iOS安全限制：請確保在用戶點擊後播放音頻')
          } else {
            showToast('error', '瀏覽器阻止自動播放，請點擊播放按鈕')
          }
        } else if (playError.name === 'NotSupportedError') {
          errorMessage = '音頻格式不支持'
          showToast('error', '您的設備不支持此音頻格式')
        } else if (playError.name === 'AbortError') {
          errorMessage = '播放被中止'
          showToast('error', '音頻播放被中止，請重試')
        } else {
          showToast('error', `播放失敗: ${playError.message}`)
        }
        
        console.error(`Play error details: ${playError.name} - ${playError.message}`)
        URL.revokeObjectURL(audioUrl)
        return
      }
      
    } catch (error: any) {
      setIsPlaying(false)
      console.error('❌ Voice generation error:', error)
      
      // Enhanced error handling for mobile
      let errorMessage = '語音生成失敗'
      
      if (error.response) {
        const status = error.response.status
        console.error(`HTTP Error: ${status}`, error.response.data)
        
        if (status === 401) {
          errorMessage = 'API 金鑰無效，請檢查 ELEVENLABS_API_KEY 設定'
        } else if (status === 429) {
          errorMessage = 'API 請求過於頻繁，請稍後再試'
        } else if (status >= 500) {
          errorMessage = '服務器錯誤，請稍後再試'
        } else if (status === 0) {
          errorMessage = '網絡連接失敗，請檢查網絡設定'
        }
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = '網絡連接失敗，請檢查網絡設定'
      } else if (error.code === 'TIMEOUT' || error.code === 'ECONNABORTED') {
        errorMessage = '請求超時，請檢查網絡連接'
      } else if (error.message?.includes('設備離線')) {
        errorMessage = error.message
      }
      
      // Show mobile-specific help
      if (isMobile()) {
        showToast('error', errorMessage + '\n\n如果問題持續，請嘗試移動端測試頁面進行診斷')
      } else {
        showToast('error', errorMessage)
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/story"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-700">語音設置 🔊</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Mobile Diagnostic Alert */}
        {isMobile() && (
          <div className="mb-8 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <Smartphone className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-orange-800 mb-2">移動設備檢測到</h3>
                <p className="text-sm text-orange-700 mb-3">
                  如果語音播放遇到問題，這可能是由於iOS Safari的音頻限制。
                  {isIOS() && ' iOS設備需要用戶手勢才能播放音頻。'}
                </p>
                <Link 
                  to="/mobile-voice-test" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  前往診斷頁面
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* Voice Selection */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-700">選擇聲音</h2>
            {isLoadingVoices && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                載入 ElevenLabs 語音中...
              </div>
            )}
          </div>
          
          {isLoadingVoices ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="p-6 rounded-2xl border-2 border-gray-200 bg-white animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => handleVoiceChange(voice.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
                    voiceSettings.voice === voice.id
                      ? 'border-pink-400 bg-pink-50 shadow-lg'
                      : 'border-gray-200 hover:border-pink-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Volume2 className="w-6 h-6 text-pink-500" />
                    <div>
                      <h3 className="font-bold text-gray-700">{voice.name}</h3>
                      {voice.category && (
                        <span className="text-xs text-gray-500 capitalize">{voice.category}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{voice.description}</p>
                  {voice.labels && Object.keys(voice.labels).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(voice.labels).slice(0, 3).map(([key, value]) => (
                        <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Pitch Control */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-700 mb-6">語調調整</h2>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">低沉</span>
              <span className="font-bold text-gray-700">語調: {voiceSettings.pitch.toFixed(1)}</span>
              <span className="text-gray-600">高亢</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={voiceSettings.pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-blue-200 to-pink-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0.5</span>
              <span>1.0</span>
              <span>1.5</span>
              <span>2.0</span>
            </div>
          </div>
        </section>

        {/* Speed Control */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-700 mb-6">語速調整</h2>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">慢速</span>
              <span className="font-bold text-gray-700">語速: {voiceSettings.speed.toFixed(1)}</span>
              <span className="text-gray-600">快速</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={voiceSettings.speed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0.5</span>
              <span>1.0</span>
              <span>1.5</span>
              <span>2.0</span>
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-6">語音預覽</h2>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {sampleText}
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={playPreview}
                disabled={isPlaying}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    播放中...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    試聽語音
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="text-center">
          <Link
            to="/story"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            保存設置
          </Link>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ec4899, #8b5cf6);
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          
          .slider::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ec4899, #8b5cf6);
            cursor: pointer;
            border: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
        `
      }} />
    </div>
  )
}