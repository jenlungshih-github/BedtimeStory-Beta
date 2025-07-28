import { create } from 'zustand'

export interface StoryElement {
  character: string
  scene: string
  theme: string
  plot: string
}

export interface VoiceSettings {
  voice: string
  pitch: number
  speed: number
}

export interface TextSettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  showPinyin: boolean
  showZhuyin: boolean
  showEnglish: boolean
  verticalLayout: boolean
}

export interface GeneratedStory {
  id: string
  title: string
  content: string
  elements: StoryElement
  createdAt: Date
}

interface StoryStore {
  // Story elements
  selectedElements: Partial<StoryElement>
  setSelectedElement: (key: keyof StoryElement, value: string) => void
  resetElements: () => void
  
  // Generated stories
  currentStory: GeneratedStory | null
  storyHistory: GeneratedStory[]
  setCurrentStory: (story: GeneratedStory) => void
  addToHistory: (story: GeneratedStory) => void
  
  // Voice settings
  voiceSettings: VoiceSettings
  setVoiceSettings: (settings: Partial<VoiceSettings>) => void
  
  // Text settings
  textSettings: TextSettings
  setTextSettings: (settings: Partial<TextSettings>) => void
  
  // Audio state
  isPlaying: boolean
  audioProgress: number
  setIsPlaying: (playing: boolean) => void
  setAudioProgress: (progress: number) => void
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  // Story elements
  selectedElements: {},
  setSelectedElement: (key, value) => 
    set((state) => ({
      selectedElements: { ...state.selectedElements, [key]: value }
    })),
  resetElements: () => set({ selectedElements: {} }),
  
  // Generated stories
  currentStory: null,
  storyHistory: [],
  setCurrentStory: (story) => set({ currentStory: story }),
  addToHistory: (story) => 
    set((state) => ({
      storyHistory: [story, ...state.storyHistory.slice(0, 9)] // Keep last 10 stories
    })),
  
  // Voice settings
  voiceSettings: {
    voice: 'gentle-female',
    pitch: 1.0,
    speed: 1.0
  },
  setVoiceSettings: (settings) => 
    set((state) => ({
      voiceSettings: { ...state.voiceSettings, ...settings }
    })),
  
  // Text settings
  textSettings: {
    fontSize: 'large',
    showPinyin: false,
    showZhuyin: true,
    showEnglish: false,
    verticalLayout: false
  },
  setTextSettings: (settings) => 
    set((state) => ({
      textSettings: { ...state.textSettings, ...settings }
    })),
  
  // Audio state
  isPlaying: false,
  audioProgress: 0,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setAudioProgress: (progress) => set({ audioProgress: progress })
}))