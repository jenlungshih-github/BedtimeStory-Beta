// Mobile debugging utilities for iOS audio issues

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

export const logMobileInfo = () => {
  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    isMobile: isMobile(),
    isIOS: isIOS(),
    isSafari: isSafari(),
    maxTouchPoints: navigator.maxTouchPoints,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    language: navigator.language,
    languages: navigator.languages,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
    connection: (navigator as any).connection,
    standalone: (window.navigator as any).standalone,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    },
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    },
    location: {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port
    },
    audioContext: {
      supported: 'AudioContext' in window || 'webkitAudioContext' in window,
      state: (() => {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext
          const ctx = new AudioContext()
          const state = ctx.state
          ctx.close()
          return state
        } catch (e) {
          return 'error: ' + e.message
        }
      })()
    }
  }
  
  console.log('📱 Mobile Debug Info:', info)
  return info
}

export const testAudioSupport = async () => {
  const results = {
    htmlAudio: false,
    audioContext: false,
    webAudio: false,
    mediaSource: false,
    formats: {
      mp3: false,
      wav: false,
      ogg: false,
      m4a: false,
      webm: false
    },
    autoplay: false,
    errors: [] as string[]
  }
  
  try {
    // Test HTML5 Audio
    const audio = new Audio()
    results.htmlAudio = true
    
    // Test audio formats
    results.formats.mp3 = audio.canPlayType('audio/mpeg') !== ''
    results.formats.wav = audio.canPlayType('audio/wav') !== ''
    results.formats.ogg = audio.canPlayType('audio/ogg') !== ''
    results.formats.m4a = audio.canPlayType('audio/mp4') !== ''
    results.formats.webm = audio.canPlayType('audio/webm') !== ''
    
    // Test autoplay
    try {
      audio.muted = true
      const playPromise = audio.play()
      if (playPromise) {
        await playPromise
        results.autoplay = true
        audio.pause()
      }
    } catch (e) {
      results.errors.push('Autoplay test failed: ' + e.message)
    }
    
  } catch (e) {
    results.errors.push('HTML Audio test failed: ' + e.message)
  }
  
  try {
    // Test Web Audio API
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContext) {
      const ctx = new AudioContext()
      results.audioContext = true
      results.webAudio = ctx.state !== undefined
      ctx.close()
    }
  } catch (e) {
    results.errors.push('AudioContext test failed: ' + e.message)
  }
  
  try {
    // Test MediaSource
    results.mediaSource = 'MediaSource' in window
  } catch (e) {
    results.errors.push('MediaSource test failed: ' + e.message)
  }
  
  console.log('🔊 Audio Support Test:', results)
  return results
}

export const createMobileAudio = (src: string) => {
  const audio = new Audio(src)
  
  // iOS optimizations
  if (isIOS()) {
    audio.preload = 'metadata'
    audio.playsInline = true
    ;(audio as any).crossOrigin = 'anonymous'
    
    // Additional iOS-specific settings
    ;(audio as any).webkitPreservesPitch = false
    ;(audio as any).mozPreservesPitch = false
    ;(audio as any).preservesPitch = false
  }
  
  return audio
}

export const logAudioError = (error: any, context: string) => {
  const errorInfo = {
    context,
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    isIOS: isIOS(),
    isMobile: isMobile(),
    isSafari: isSafari()
  }
  
  console.error('🚨 Audio Error:', errorInfo)
  return errorInfo
}
