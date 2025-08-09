import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStoryStore } from '../store/storyStore'
import { useTextSettings } from '../hooks/useTextSettings'
import { generateSpeech } from '../services/storyService'
import { formatTextWithSettings, getFontSizeClass, getMissingZhuyinSuggestions, autoGenerateZhuyinMapping } from '../utils/textUtils'
import { logMobileInfo, testAudioSupport, createMobileAudio, logAudioError, isIOS, isMobile } from '../utils/mobileDebug'
import { ArrowLeft, Play, Pause, Volume2, Settings, Type, RotateCcw, BookOpen, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export default function StoryReader() {
  const [searchParams] = useSearchParams()
  const storyId = searchParams.get('id')
  
  const {
    currentStory,
    storyHistory,
    voiceSettings,
    isPlaying,
    audioProgress,
    setIsPlaying,
    setAudioProgress
  } = useStoryStore()
  
  const { textSettings } = useTextSettings()
  
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [zhuyinUpdateKey, setZhuyinUpdateKey] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  
  // Get story from history if ID is provided
  const story = storyId 
    ? storyHistory.find(s => s.id === storyId) || currentStory
    : currentStory

  // Auto-generate Zhuyin mapping when story loads
  useEffect(() => {
    if (story?.content) {
      console.log('正在檢查故事注音覆蓋率:', story.title)
      const result = autoGenerateZhuyinMapping(story.content)
      console.log('自動生成結果:', result)
      
      // Always update the key to force re-render, even if no new characters were generated
      setZhuyinUpdateKey(prev => prev + 1)
      
      if (result.generatedCount > 0) {
        toast.success(`自動生成了 ${result.generatedCount} 個注音符號！`)
      } else if (result.totalMissing > 0) {
        console.log(`仍有 ${result.totalMissing} 個字符缺少注音`)
      } else {
        console.log('所有字符都已有注音覆蓋')
      }
    }
  }, [story?.content, story?.id])

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current
      
      const updateProgress = () => {
        if (audio.duration) {
          const progress = (audio.currentTime / audio.duration) * 100
          setAudioProgress(progress)
        }
      }
      
      const handleEnded = () => {
        setIsPlaying(false)
        setAudioProgress(0)
      }
      
      audio.addEventListener('timeupdate', updateProgress)
      audio.addEventListener('ended', handleEnded)
      
      return () => {
        audio.removeEventListener('timeupdate', updateProgress)
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [audioUrl, setIsPlaying, setAudioProgress])

  const handlePlayPause = async () => {
    if (!story) return
    
    if (!audioUrl) {
      await generateAudio()
      return
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        try {
          // iOS requires user gesture for audio playback
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            await playPromise
          }
          setIsPlaying(true)
        } catch (error) {
          logAudioError(error, 'handlePlayPause')
          if (error.name === 'NotAllowedError') {
            toast.error('請點擊播放按鈕來啟動音頻播放（iOS 安全限制）')
          } else {
            toast.error('音頻播放失敗，請重試')
          }
        }
      }
    }
  }
  
  const generateAudio = async () => {
    if (!story) return
    
    setIsLoadingAudio(true)
    
    try {
      const audioBlob = await generateSpeech(
        story.content,
        voiceSettings.voice,
        voiceSettings.pitch,
        voiceSettings.speed
      )
      
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.load() // Important for iOS
        
        try {
          // iOS requires user gesture for audio playback
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            await playPromise
          }
          setIsPlaying(true)
        } catch (playError) {
          logAudioError(playError, 'generateAudio auto-play')
          // Don't show error for auto-play failure, just prepare audio
          setIsPlaying(false)
        }
      }
      
      toast.success('語音生成成功！')
    } catch (error) {
      console.error('Voice generation error:', error)
      
      // Enhanced error handling for mobile
      let errorMessage = '語音生成失敗'
      
      if (error.response) {
        const status = error.response.status
        if (status === 401) {
          errorMessage = 'API 金鑰無效，請檢查 ELEVENLABS_API_KEY 設定'
        } else if (status === 429) {
          errorMessage = 'API 請求過於頻繁，請稍後再試'
        } else if (status >= 500) {
          errorMessage = '服務器錯誤，請稍後再試'
        }
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = '網絡連接失敗，請檢查網絡設定'
      } else if (error.code === 'TIMEOUT') {
        errorMessage = '請求超時，請檢查網絡連接'
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoadingAudio(false)
    }
  }
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * audioRef.current.duration
    
    audioRef.current.currentTime = newTime
    setAudioProgress(percentage * 100)
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">沒有找到故事</h2>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            創作新故事
          </Link>
        </div>
      </div>
    )
  }

  // Mobile debugging and audio support detection
  useEffect(() => {
    if (isMobile()) {
      logMobileInfo()
      testAudioSupport().then(results => {
        console.log('Audio support results:', results)
        if (results.errors.length > 0) {
          console.warn('Audio support issues detected:', results.errors)
        }
      })
    }
    
    // Debug: Check localStorage directly
    const storedSettings = localStorage.getItem('textSettings')
    console.log('Direct localStorage check:', storedSettings)
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings)
      console.log('Parsed localStorage settings:', parsed)
    }
  }, [])

  // Re-format text when Zhuyin mapping updates
  console.log('StoryReader textSettings:', textSettings)
  console.log('About to call formatTextWithSettings with:', { showPinyin: textSettings.showPinyin, showZhuyin: textSettings.showZhuyin })
  const formattedText = formatTextWithSettings(story.content, textSettings)
  console.log('formatTextWithSettings returned:', typeof formattedText === 'string' ? formattedText.substring(0, 100) + '...' : 'array')
  const fontSizeClass = getFontSizeClass(textSettings.fontSize)
  
  // Force re-render when Zhuyin mapping updates
  const textKey = `${story.id}-${zhuyinUpdateKey}`

  return (
    <div className="min-h-screen">
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
              <h1 className="text-xl font-bold text-gray-700 truncate">
                {story.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/voice-settings"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="語音設置"
              >
                <Volume2 className="w-5 h-5 text-gray-600" />
              </Link>
              <Link
                to="/text-settings"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="文字設置"
              >
                <Type className="w-5 h-5 text-gray-600" />
              </Link>
              {/* Mobile Debug Button */}
              {isMobile() && (
                <button
                  onClick={async () => {
                    console.log('=== MOBILE DEBUG INFO ===')
                    console.log('Current textSettings:', textSettings)
                    console.log('localStorage textSettings:', localStorage.getItem('textSettings'))
                    
                    // Mobile-specific debugging
                    const mobileInfo = logMobileInfo()
                    const audioSupport = await testAudioSupport()
                    
                    // Test audio creation
                    try {
                      const testAudio = createMobileAudio('')
                      console.log('Test audio created:', testAudio)
                    } catch (e) {
                      console.error('Test audio creation failed:', e)
                    }
                    
                    // Show debug info in alert for mobile
                    const debugInfo = `
設備: ${isIOS() ? 'iOS' : isMobile() ? 'Mobile' : 'Desktop'}
瀏覽器: ${navigator.userAgent.split(' ').pop()}
音頻支持: ${audioSupport.htmlAudio ? '✓' : '✗'}
MP3支持: ${audioSupport.formats.mp3 ? '✓' : '✗'}
自動播放: ${audioSupport.autoplay ? '✓' : '✗'}
錯誤數量: ${audioSupport.errors.length}
                    `
                    alert(debugInfo)
                    
                    // Clear localStorage and reload option
                    if (confirm('清除本地存儲並重新加載？')) {
                      localStorage.clear()
                      window.location.reload()
                    }
                  }}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  📱
                </button>
              )}
              <Link
                to="/create"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="重新創作"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </header>



      {/* Story Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div key={textKey} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {textSettings.verticalLayout && Array.isArray(formattedText) ? (
            <div className="flex flex-row-reverse gap-6 overflow-x-auto min-h-96" style={{ 
              writingMode: 'vertical-rl', 
              textOrientation: 'upright',
              direction: 'rtl'
            }}>
              {formattedText.map((column, index) => (
                <div 
                  key={index}
                  className={`${fontSizeClass} text-gray-800 flex flex-col items-center`}
                  style={{ 
                    lineHeight: '1.8',
                    letterSpacing: '0.1em',
                    writingMode: 'vertical-rl',
                    textOrientation: 'upright',
                    minHeight: '400px',
                    paddingTop: '1rem',
                    paddingBottom: '1rem'
                  }}
                  dangerouslySetInnerHTML={{ __html: column }}
                />
              ))}
            </div>
          ) : (
            <div 
              className={`${fontSizeClass} leading-relaxed text-gray-800`}
              style={{ lineHeight: '2.5' }}
              dangerouslySetInnerHTML={{ __html: formattedText }}
            />
          )}
        </div>
      </main>

      {/* Audio Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="w-full h-2 bg-gray-200 rounded-full mb-4 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${audioProgress}%` }}
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePlayPause}
              disabled={isLoadingAudio}
              className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingAudio ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>
            
            <div className="text-sm text-gray-600">
              {isLoadingAudio ? '正在生成語音...' : audioUrl ? '點擊播放' : '點擊生成語音'}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element with iOS optimizations */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        playsInline
        controls={false}
        muted={false}
        crossOrigin="anonymous"
      />
      

      
      {/* Bottom Padding for Fixed Controls */}
      <div className="h-32" />
    </div>
  )
}