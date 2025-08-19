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

export interface Comment {
  id: string
  text: string
  author: string
  createdAt: Date
}

export interface GeneratedStory {
  id: string
  title: string
  content: string
  elements: StoryElement
  createdAt: Date
  comments: Comment[]
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
  
  // Comments
  addComment: (storyId: string, text: string, author: string) => void
  getLatestComment: () => Comment | null
  
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
      storyHistory: [{ ...story, comments: story.comments || [] }, ...state.storyHistory.slice(0, 9)] // Keep last 10 stories
    })),
  
  // Comments
  addComment: (storyId, text, author) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      author,
      createdAt: new Date()
    }
    
    set((state) => {
      // Update current story if it matches
      const updatedCurrentStory = state.currentStory?.id === storyId 
        ? { ...state.currentStory, comments: [...(state.currentStory.comments || []), newComment] }
        : state.currentStory
      
      // Update story history
      const updatedHistory = state.storyHistory.map(story => 
        story.id === storyId 
          ? { ...story, comments: [...(story.comments || []), newComment] }
          : story
      )
      
      return {
        currentStory: updatedCurrentStory,
        storyHistory: updatedHistory
      }
    })
  },
  
  getLatestComment: () => {
    const state = get()
    const allComments: Comment[] = []
    
    // Collect comments from current story
    if (state.currentStory?.comments) {
      allComments.push(...state.currentStory.comments)
    }
    
    // Collect comments from story history
    state.storyHistory.forEach(story => {
      if (story.comments) {
        allComments.push(...story.comments)
      }
    })
    
    // Return the latest comment by date
    if (allComments.length === 0) return null
    
    return allComments.reduce((latest, comment) => 
      new Date(comment.createdAt) > new Date(latest.createdAt) ? comment : latest
    )
  },
  
  // Voice settings
  voiceSettings: {
    voice: 'hkfHEbBvdQFNX4uWHqRF', // Stacy - Sweet and Cute Chinese/English female voice
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