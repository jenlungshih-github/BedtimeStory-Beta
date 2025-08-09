import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Volume2, Smartphone, Wifi, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { generateSpeech } from '../services/storyService'
import { logMobileInfo, testAudioSupport, createMobileAudio, logAudioError, isIOS, isMobile } from '../utils/mobileDebug'

const testTexts = [
  '你好，這是語音測試。',
  '小兔子在森林裡快樂地跳躍。',
  'Hello, this is a voice test.'
]

export default function MobileVoiceTest() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [testResults, setTestResults] = useState<any>(null)
  const [mobileInfo, setMobileInfo] = useState<any>(null)
  const [errorLogs, setErrorLogs] = useState<string[]>([])
  const [selectedText, setSelectedText] = useState(testTexts[0])
  const [audioSupport, setAudioSupport] = useState<any>(null)

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

  const testVoiceGeneration = async () => {
    if (isPlaying && currentAudio) {
      currentAudio.pause()
      setIsPlaying(false)
      setCurrentAudio(null)
      addErrorLog('音頻播放已停止')
      return
    }

    setIsPlaying(true)
    addErrorLog(`開始測試語音生成: "${selectedText}"`)
    
    try {
      // Step 1: Test network connectivity
      addErrorLog('檢查網絡連接...')
      if (!navigator.onLine) {
        throw new Error('設備離線，請檢查網絡連接')
      }
      addErrorLog('✅ 網絡連接正常')

      // Step 2: Test API call
      addErrorLog('調用語音生成API...')
      const startTime = Date.now()
      
      const audioBlob = await generateSpeech(
        selectedText,
        'hkfHEbBvdQFNX4uWHqRF', // Stacy voice
        1.0, // pitch
        1.0  // speed
      )
      
      const apiTime = Date.now() - startTime
      addErrorLog(`✅ API調用成功，耗時: ${apiTime}ms，音頻大小: ${audioBlob.size} bytes`)
      
      // Enhanced audio blob validation
      addErrorLog('🔍 開始詳細音頻數據檢測...')
      
      // Check blob properties
      addErrorLog(`音頻類型: ${audioBlob.type || '未知'}`)
      addErrorLog(`音頻大小: ${audioBlob.size} bytes`)
      
      if (audioBlob.size === 0) {
        addErrorLog('❌ 致命錯誤: 收到空的音頻數據')
        throw new Error('收到空的音頻數據 - API返回了0字節的響應')
      }
      
      if (audioBlob.size < 100) {
        addErrorLog(`⚠️ 警告: 音頻文件異常小 (${audioBlob.size} bytes)，可能不是有效的音頻數據`)
      }
      
      // Validate blob type
      if (!audioBlob.type) {
        addErrorLog('⚠️ 警告: 音頻數據沒有MIME類型信息')
      } else if (!audioBlob.type.includes('audio')) {
        addErrorLog(`⚠️ 警告: 意外的MIME類型 "${audioBlob.type}"，期望audio/*`)
      }
      
      // Try to read first few bytes to validate audio format
      try {
        const arrayBuffer = await audioBlob.slice(0, 16).arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        const header = Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join(' ')
        addErrorLog(`音頻文件頭: ${header}`)
        
        // Check for common audio file signatures
        const headerStr = Array.from(uint8Array).map(b => String.fromCharCode(b)).join('')
        if (headerStr.includes('ID3') || uint8Array[0] === 0xFF) {
          addErrorLog('✅ 檢測到MP3音頻格式標識')
        } else if (headerStr.includes('RIFF')) {
          addErrorLog('✅ 檢測到WAV音頻格式標識')
        } else {
          addErrorLog('⚠️ 未識別的音頻格式，但可能仍然有效')
        }
      } catch (headerError) {
        addErrorLog(`⚠️ 無法讀取音頻文件頭: ${headerError}`)
      }
      
      // Step 3: Create audio URL
      let audioUrl: string
      try {
        audioUrl = URL.createObjectURL(audioBlob)
        addErrorLog(`✅ 音頻URL創建成功: ${audioUrl.substring(0, 50)}...`)
      } catch (urlError) {
        addErrorLog(`❌ 音頻URL創建失敗: ${urlError}`)
        throw new Error(`無法創建音頻URL: ${urlError}`)
      }
      
      // Step 4: Create audio element with mobile optimizations
      const audio = createMobileAudio(audioUrl)
      addErrorLog('✅ 音頻元素創建成功，應用移動端優化')
      
      // Step 5: Set up event listeners
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
        URL.revokeObjectURL(audioUrl)
      }
      
      audio.onerror = (e) => {
        const errorInfo = logAudioError(e, 'Audio playback error')
        addErrorLog(`❌ 音頻播放錯誤: ${errorInfo.message}`)
        setIsPlaying(false)
        setCurrentAudio(null)
        URL.revokeObjectURL(audioUrl)
        toast.error('音頻播放失敗')
      }
      
      audio.onstalled = () => addErrorLog('⚠️ 音頻加載停滯')
      audio.onsuspend = () => addErrorLog('⚠️ 音頻加載暫停')
      audio.onwaiting = () => addErrorLog('⚠️ 音頻等待數據')
      
      setCurrentAudio(audio)
      
      // Step 6: Attempt to play
      addErrorLog('嘗試播放音頻...')
      
      try {
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          await playPromise
          addErrorLog('✅ 音頻播放成功啟動')
        }
      } catch (playError: any) {
        const errorInfo = logAudioError(playError, 'Audio play() method error')
        addErrorLog(`❌ 播放失敗: ${errorInfo.name} - ${errorInfo.message}`)
        
        setIsPlaying(false)
        setCurrentAudio(null)
        
        if (playError.name === 'NotAllowedError') {
          toast.error('iOS需要用戶手勢才能播放音頻，請點擊播放按鈕')
          addErrorLog('ℹ️ NotAllowedError: iOS安全限制，需要用戶手勢')
        } else if (playError.name === 'NotSupportedError') {
          toast.error('音頻格式不支持')
          addErrorLog('ℹ️ NotSupportedError: 音頻格式不支持')
        } else {
          toast.error(`播放失敗: ${playError.message}`)
        }
        
        URL.revokeObjectURL(audioUrl)
        return
      }
      
    } catch (error: any) {
      setIsPlaying(false)
      addErrorLog(`❌ 語音生成失敗: ${error.message}`)
      
      // Enhanced error analysis
      if (error.response) {
        addErrorLog(`HTTP狀態碼: ${error.response.status}`)
        addErrorLog(`響應數據: ${JSON.stringify(error.response.data).substring(0, 200)}`)
      }
      
      if (error.code) {
        addErrorLog(`錯誤代碼: ${error.code}`)
      }
      
      if (error.config) {
        addErrorLog(`請求URL: ${error.config.url}`)
        addErrorLog(`請求方法: ${error.config.method}`)
        addErrorLog(`超時設置: ${error.config.timeout}ms`)
      }
      
      toast.error(`語音生成失敗: ${error.message}`)
    }
  }

  const clearLogs = () => {
    setErrorLogs([])
    addErrorLog('日誌已清空')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
              </div>
              {audioSupport.errors.length > 0 && (
                <div className="mt-4">
                  <strong className="text-red-600">錯誤:</strong>
                  <ul className="text-xs text-red-600 mt-1">
                    {audioSupport.errors.map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
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

            {/* Test Button */}
            <button
              onClick={testVoiceGeneration}
              disabled={false}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isPlaying ? (
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
          </div>
        </section>

        {/* Error Logs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              測試日誌
            </h2>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              清空日誌
            </button>
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