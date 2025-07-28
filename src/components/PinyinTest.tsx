import React from 'react'
import { formatTextWithSettings } from '../utils/textUtils'

const PinyinTest: React.FC = () => {
  const testText = '小兔子在森林裡'
  
  const testSettings = {
    showPinyin: true,
    showZhuyin: false,
    verticalLayout: false,
    fontSize: 'large',
    showEnglish: false
  }
  
  const formattedText = formatTextWithSettings(testText, testSettings)
  
  console.log('PinyinTest - testText:', testText)
  console.log('PinyinTest - testSettings:', testSettings)
  console.log('PinyinTest - formattedText:', formattedText)
  
  return (
    <div className="p-4 border border-gray-300 m-4">
      <h3 className="text-lg font-bold mb-2">Pinyin Test Component</h3>
      <p className="mb-2">Original text: {testText}</p>
      <div 
        className="text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formattedText as string }}
      />
    </div>
  )
}

export default PinyinTest