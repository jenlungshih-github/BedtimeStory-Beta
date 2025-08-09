import axios from 'axios'
import { StoryElement, GeneratedStory } from '../store/storyStore'
import { checkZhuyinCoverage } from '../utils/textUtils'

// Story templates for different combinations
const storyTemplates = {
  friendship: {
    forest: '在茂密的森林裡，{character}遇到了一隻迷路的小動物。{character}決定幫助它找到回家的路。在尋找的過程中，他們成為了最好的朋友，一起分享快樂和困難。',
    garden: '在美麗的花園裡，{character}發現了一朵會說話的花。這朵花很孤單，{character}每天都來陪它聊天，他們成為了特別的朋友。',
    castle: '在高高的城堡裡，{character}遇到了一位孤單的小公主。{character}用自己的善良和友誼溫暖了公主的心，他們一起在城堡裡快樂地玩耍。'
  },
  courage: {
    forest: '勇敢的{character}在森林裡遇到了一個大挑戰。雖然心裡有點害怕，但{character}深深吸了一口氣，鼓起勇氣面對困難，最終成功克服了挑戰。',
    space: '太空探險家{character}的飛船遇到了故障。在黑暗的太空中，{character}沒有放棄，勇敢地修理飛船，最終安全返回了地球。',
    ocean: '在深藍的海洋裡，{character}遇到了巨大的海浪。{character}沒有退縮，勇敢地游向岸邊，證明了自己的勇氣。'
  },
  sharing: {
    farm: '在農場裡，{character}收穫了很多美味的果實。當看到其他小動物餓肚子時，{character}開心地分享了自己的食物，大家一起享受美味。',
    garden: '在花園裡，{character}找到了一籃子美麗的花朵。{character}把花朵分享給所有的朋友，讓整個花園都充滿了歡聲笑語。',
    castle: '在城堡的寶庫裡，{character}發現了許多寶藏。{character}決定把寶藏分享給需要幫助的人，成為了大家心中的英雄。'
  },
  helping: {
    forest: '在森林裡，{character}看到一隻小鳥從樹上掉下來。{character}輕輕地把小鳥放回巢穴，小鳥的媽媽非常感謝{character}的幫助。',
    farm: '在農場裡，農夫爺爺生病了。善良的{character}主動幫忙照顧農場的動物，讓爺爺能夠好好休息。',
    rainbow: '在彩虹橋上，{character}遇到了一個迷路的小精靈。{character}耐心地指引小精靈回家的路，小精靈送給{character}一個神奇的禮物。'
  },
  adventure: {
    space: '勇敢的太空探險家{character}駕駛著飛船來到了一個神秘的星球。在這裡，{character}發現了會發光的石頭和友善的外星朋友。',
    magic_forest: '在神奇的魔法森林裡，{character}遇到了會說話的樹木和跳舞的蘑菇。{character}和森林裡的魔法生物一起度過了奇妙的冒險時光。',
    castle: '在古老的城堡裡，{character}發現了一個秘密通道。跟隨著通道，{character}找到了傳說中的寶藏和一本神奇的魔法書。'
  },
  learning: {
    forest: '在森林學校裡，{character}學習如何辨認不同的樹葉和花朵。通過努力學習，{character}成為了森林裡最棒的小博士。',
    farm: '在農場裡，{character}跟著農夫爺爺學習如何種植蔬菜。經過耐心的練習，{character}種出了最美味的蘿蔔。',
    ocean: '在海洋學校裡，{character}學習如何游泳。雖然一開始有點困難，但{character}沒有放棄，最終學會了優美的游泳技巧。'
  }
}

// Character names mapping
const characterNames: Record<string, string> = {
  rabbit: '小兔子',
  bear: '小熊',
  cat: '小貓',
  dog: '小狗',
  bird: '小鳥',
  fish: '小魚',
  elephant: '小象',
  monkey: '小猴子',
  pig: '小豬',
  sheep: '小羊',
  duck: '小鴨',
  mouse: '小老鼠'
}

// Scene names mapping
const sceneNames: Record<string, string> = {
  forest: '森林',
  ocean: '海邊',
  garden: '花園',
  castle: '城堡',
  farm: '農場',
  space: '太空',
  rainbow: '彩虹橋',
  magic_forest: '魔法森林'
}

export const generateStory = (elements: StoryElement, customCharacterName?: string): GeneratedStory & { zhuyinCheck?: { hasFullCoverage: boolean; missingChars: string[] } } => {
  const { character, scene, theme, plot } = elements
  
  // Get template based on theme and scene
  const themeTemplates = storyTemplates[theme as keyof typeof storyTemplates] || storyTemplates.friendship
  const template = themeTemplates[scene as keyof typeof themeTemplates] || themeTemplates[Object.keys(themeTemplates)[0] as keyof typeof themeTemplates]
  
  // Replace character placeholder - use custom name if provided, otherwise use mapping
  const characterName = customCharacterName || characterNames[character] || '小動物'
  let storyContent = (template as string).replace(/{character}/g, characterName)
  
  // Add plot element
  const plotEndings: Record<string, string> = {
    difficulty: '在遇到困難時，' + characterName + '學會了堅持不懈，最終克服了所有挑戰。',
    treasure: '最後，' + characterName + '找到了真正的寶藏——那就是友誼和快樂。',
    friend: '通過這次經歷，' + characterName + '結交了許多新朋友，大家一起快樂地生活。',
    skill: '經過努力學習，' + characterName + '掌握了新的技能，變得更加自信和快樂。'
  }
  
  const plotEnding = plotEndings[plot] || plotEndings.friend
  storyContent += ' ' + plotEnding
  
  // Generate title
  const sceneName = sceneNames[scene] || '奇妙世界'
  const title = `${characterName}在${sceneName}的故事`
  
  // Check Zhuyin coverage
  const zhuyinCheck = checkZhuyinCoverage(storyContent)
  
  return {
    id: Date.now().toString(),
    title,
    content: storyContent,
    elements,
    createdAt: new Date(),
    zhuyinCheck
  }
}

// ElevenLabs API configuration
// Use relative path for production, localhost for development
const ELEVENLABS_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api/elevenlabs'
  : '/api/elevenlabs'

// Voice ID mapping
const voiceIds: Record<string, string> = {
  'stacy': 'hkfHEbBvdQFNX4uWHqRF', // Stacy - Sweet and Cute Chinese/English female voice
  'gentle-female': 'EXAVITQu4vr4xnSDxMaL', // Bella
  'lively-female': 'ThT5KcBeYPX3keUQqHPh', // Dorothy
  'kind-male': 'VR6AewLTigWG4xSOukaG', // Josh
  'young-male': 'TxGEqnHWrfWFTfGW9XjX', // Brian
  'child-voice': 'pFZP5JQG7iQjIQuC4Bku', // Lily
  'robot-voice': 'EXAVITQu4vr4xnSDxMaL' // Using Bella as fallback
}

export const generateSpeech = async (text: string, voice: string, pitch: number = 1.0, speed: number = 1.0): Promise<Blob> => {
  try {
    // Check if voice is already a voice_id (from ElevenLabs API) or needs mapping
    const voiceId = voiceIds[voice] || voice || 'hkfHEbBvdQFNX4uWHqRF' // Default to Stacy
    
    const response = await axios.post(
      `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
          pitch: pitch,
          speed: speed
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json'
        },
        responseType: 'blob',
        timeout: 30000 // 30 second timeout for mobile networks
      }
    )
    
    return response.data
  } catch (error: any) {
    console.error('Error generating speech:', error)
    
    // Handle specific mobile/network errors
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      throw new Error('網路連線問題，請檢查您的網路連線後重試')
    }
    
    if (error.response?.status === 0 || error.code === 'ECONNABORTED') {
      throw new Error('連線逾時，請稍後再試')
    }
    
    if (error.response?.status === 401) {
      throw new Error('語音服務認證失敗，請聯繫管理員')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('語音服務暫時無法使用，請稍後再試')
    }
    
    throw new Error('語音生成失敗，請稍後再試')
  }
}

// ElevenLabs Voice interface
interface ElevenLabsVoice {
  voice_id: string
  name: string
  category: string
  description?: string
  labels?: Record<string, string>
  preview_url?: string
}

// Fetch voices from ElevenLabs API
export const fetchElevenLabsVoices = async (): Promise<ElevenLabsVoice[]> => {
  try {
    const response = await axios.get(`${ELEVENLABS_BASE_URL}/voices`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000 // 15 second timeout for voice list
    })
    
    return response.data.voices || []
  } catch (error: any) {
    console.error('Error fetching ElevenLabs voices:', error)
    
    // Log specific error for debugging mobile issues
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      console.warn('Network error fetching voices, using fallback voices')
    }
    
    // Return fallback voices if API fails
    return [
      { voice_id: 'hkfHEbBvdQFNX4uWHqRF', name: 'Stacy', category: 'premade' },
      { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', category: 'premade' },
      { voice_id: 'ThT5KcBeYPX3keUQqHPh', name: 'Dorothy', category: 'premade' },
      { voice_id: 'VR6AewLTigWG4xSOukaG', name: 'Josh', category: 'premade' },
      { voice_id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Brian', category: 'premade' },
      { voice_id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', category: 'premade' }
    ]
  }
}

// Get available voices (now fetches from ElevenLabs)
export const getAvailableVoices = async () => {
  const elevenLabsVoices = await fetchElevenLabsVoices()
  
  // Transform ElevenLabs voices to our format
  return elevenLabsVoices.map(voice => ({
    id: voice.voice_id,
    name: voice.name,
    description: voice.description || `${voice.name} - ${voice.category} voice`,
    category: voice.category,
    labels: voice.labels,
    preview_url: voice.preview_url
  }))
}

// Legacy function for backward compatibility
export const getAvailableVoicesSync = () => [
  { id: 'hkfHEbBvdQFNX4uWHqRF', name: 'Stacy', description: '甜美可愛的中英文女性聲音' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: '溫暖柔和的女性聲音' },
  { id: 'ThT5KcBeYPX3keUQqHPh', name: 'Dorothy', description: '充滿活力的女性聲音' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Josh', description: '溫和親切的男性聲音' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Brian', description: '清新年輕的男性聲音' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: '可愛的兒童聲音' }
]