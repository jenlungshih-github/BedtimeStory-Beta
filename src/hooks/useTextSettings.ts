import { useState, useEffect } from 'react'

interface TextSettings {
  fontSize: string
  showPinyin: boolean
  showZhuyin: boolean
  showEnglish: boolean
  verticalLayout: boolean
}

const defaultSettings: TextSettings = {
  fontSize: 'large',
  showPinyin: false,
  showZhuyin: false,
  showEnglish: false,
  verticalLayout: false
}

export const useTextSettings = () => {
  const [textSettings, setTextSettingsState] = useState<TextSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('textSettings')
    console.log('Loading settings from localStorage:', savedSettings)
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        console.log('Parsed settings:', parsed)
        const finalSettings = { ...defaultSettings, ...parsed }
        console.log('Final settings after merge:', finalSettings)
        setTextSettingsState(finalSettings)
      } catch (error) {
        console.error('Failed to parse saved text settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    console.log('Saving settings to localStorage:', textSettings)
    localStorage.setItem('textSettings', JSON.stringify(textSettings))
  }, [textSettings])

  const setTextSettings = (updates: Partial<TextSettings>) => {
    console.log('setTextSettings called with updates:', updates)
    let updatedSettings = { ...textSettings, ...updates }
    
    // Make pinyin and zhuyin mutually exclusive
    if (updates.showPinyin === true) {
      updatedSettings.showZhuyin = false
      console.log('Pinyin enabled, disabling Zhuyin')
    } else if (updates.showZhuyin === true) {
      updatedSettings.showPinyin = false
      console.log('Zhuyin enabled, disabling Pinyin')
    }
    
    console.log('Final updated settings:', updatedSettings)
    setTextSettingsState(updatedSettings)
  }

  return {
    textSettings,
    setTextSettings
  }
}