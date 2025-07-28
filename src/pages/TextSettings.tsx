import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Type } from 'lucide-react'
import { useTextSettings } from '../hooks/useTextSettings'
import { formatTextWithSettings, getFontSizeClass } from '../utils/textUtils'

const TextSettings: React.FC = () => {
  const { textSettings, setTextSettings } = useTextSettings()
  const navigate = useNavigate()

  // Debug: Log when component mounts
  React.useEffect(() => {
    console.log('🚀 TextSettings component mounted')
    console.log('📋 Initial textSettings:', textSettings)
    console.log('💾 localStorage on mount:', localStorage.getItem('textSettings'))
  }, [])

  const fontSizes = [
    { id: 'small', name: '小', description: '適合年齡較大的孩子' },
    { id: 'medium', name: '中', description: '標準閱讀大小' },
    { id: 'large', name: '大', description: '適合幼兒閱讀' },
    { id: 'extra-large', name: '超大', description: '最適合學齡前兒童' }
  ]

  const sampleText = '小兔子在森林裡遇到了一隻迷路的小動物。小兔子決定幫助它找到回家的路。在尋找的過程中，他們成為了最好的朋友，一起分享快樂和困難。'

  const handleFontSizeChange = (size: string) => {
    setTextSettings({ fontSize: size })
  }

  const handleToggleOption = (option: 'showPinyin' | 'showZhuyin') => {
    const newValue = !textSettings[option]
    console.log(`Toggling ${option} to:`, newValue)
    
    if (option === 'showPinyin' && newValue) {
      // When enabling Pinyin, disable Zhuyin
      setTextSettings({ showPinyin: true, showZhuyin: false })
    } else if (option === 'showZhuyin' && newValue) {
      // When enabling Zhuyin, disable Pinyin
      setTextSettings({ showZhuyin: true, showPinyin: false })
    } else {
      // For other options or when disabling
      setTextSettings({ [option]: newValue })
    }
  }

  const previewText = formatTextWithSettings(sampleText, textSettings)
  const fontSizeClass = getFontSizeClass(textSettings.fontSize)

  // Debug: Show current settings in console
  React.useEffect(() => {
    console.log('🎯 TextSettings component - Current textSettings:', textSettings)
    console.log('📱 TextSettings component - localStorage content:', localStorage.getItem('textSettings'))
  }, [textSettings])

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
            <h1 className="text-2xl font-bold text-gray-700">文字設置 📝</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Font Size Selection */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-700 mb-6">字體大小</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleFontSizeChange(size.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 text-center ${
                  textSettings.fontSize === size.id
                    ? 'border-blue-400 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className={`font-bold text-gray-700 mb-2 ${
                  size.id === 'small' ? 'text-lg' :
                  size.id === 'medium' ? 'text-xl' :
                  size.id === 'large' ? 'text-2xl' : 'text-4xl'
                }`}>
                  {size.name}
                </div>
                <p className="text-sm text-gray-600">{size.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Text Assistance Options */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-700 mb-6">輔助文字顯示</h2>
          <div className="space-y-4">
            {/* Zhuyin Option */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-700 mb-2">注音符號 (ㄅㄆㄇㄈ)</h3>
                  <p className="text-gray-600 text-sm mb-3">在中文字旁顯示注音符號，幫助學習發音</p>
                  <div className="text-lg text-gray-700 flex items-start">
                    <span className="mr-2">示例：</span>
                    <div className="flex">
                      <span className="inline-block relative mr-6">
                        <span className="inline-block">小</span>
                        <span className="absolute -right-5 top-0 flex flex-col items-center justify-start h-full text-xs leading-tight">
                          <span className="block text-center">ㄒ</span>
                          <span className="block text-center">ㄧ</span>
                          <span className="block text-center">ㄠ</span>
                          <span className="block text-center">ˇ</span>
                        </span>
                      </span>
                      <span className="inline-block relative mr-6">
                        <span className="inline-block">兔</span>
                        <span className="absolute -right-5 top-0 flex flex-col items-center justify-start h-full text-xs leading-tight">
                          <span className="block text-center">ㄊ</span>
                          <span className="block text-center">ㄨ</span>
                          <span className="block text-center">ˋ</span>
                        </span>
                      </span>
                      <span className="inline-block relative mr-6">
                        <span className="inline-block">子</span>
                        <span className="absolute -right-5 top-0 flex flex-col items-center justify-start h-full text-xs leading-tight">
                          <span className="block text-center">ㄗ</span>
                          <span className="block text-center">˙</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleOption('showZhuyin')}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    textSettings.showZhuyin
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {textSettings.showZhuyin && <Check className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Pinyin Option */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-700 mb-2">漢語拼音 (Pinyin)</h3>
                  <p className="text-gray-600 text-sm mb-3">在中文字旁顯示拼音，幫助學習普通話發音</p>
                  <div className="text-lg text-gray-700">
                    示例：小(xiǎo)兔(tù)子(zi)
                  </div>
                </div>
                <button
                  onClick={() => handleToggleOption('showPinyin')}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    textSettings.showPinyin
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {textSettings.showPinyin && <Check className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Vertical Layout Option */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-700 mb-2">直式排版</h3>
                  <p className="text-gray-600 text-sm mb-3">使用傳統中文直式排版，從右到左閱讀</p>
                  <div className="text-lg text-gray-700">
                    示例：傳統中文直式排版效果
                  </div>
                </div>
                <button
                   onClick={() => setTextSettings({ verticalLayout: !textSettings.verticalLayout })}
                   className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                     textSettings.verticalLayout
                       ? 'bg-green-500 border-green-500 text-white'
                       : 'border-gray-300 hover:border-green-400'
                   }`}
                 >
                   {textSettings.verticalLayout && <Check className="w-6 h-6" />}
                 </button>
              </div>
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-6">預覽效果</h2>
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {textSettings.verticalLayout && Array.isArray(previewText) ? (
                <div className="flex flex-row-reverse gap-6 overflow-x-auto min-h-64" style={{ 
                  writingMode: 'vertical-rl', 
                  textOrientation: 'upright',
                  direction: 'rtl'
                }}>
                  {previewText.map((column, index) => (
                    <div 
                      key={index}
                      className={`${fontSizeClass} text-gray-800 flex flex-col items-center`}
                      style={{ 
                        lineHeight: '1.8',
                        letterSpacing: '0.1em',
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        minHeight: '250px',
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
                  dangerouslySetInnerHTML={{ __html: previewText }}
                />
              )}
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              這是文字顯示的預覽效果
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Type className="w-5 h-5" />
              使用建議
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>超大字體</strong>：適合3-5歲幼兒，方便閱讀</li>
              <li>• <strong>注音符號</strong>：幫助學習中文發音，適合台灣地區</li>
              <li>• <strong>漢語拼音</strong>：幫助學習普通話發音，適合大陸地區</li>
              <li>• 可以同時開啟多個輔助選項，根據孩子需要調整</li>
            </ul>
          </div>
        </section>

        {/* Debug Section */}
        <section className="mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="font-bold text-gray-700 mb-4">調試信息</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>當前設置: {JSON.stringify(textSettings)}</div>
              <div>localStorage內容: {localStorage.getItem('textSettings')}</div>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                清除設置並重新載入
              </button>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={() => {
              console.log('💾 Save button clicked, current settings:', textSettings)
              console.log('💾 localStorage content:', localStorage.getItem('textSettings'))
              navigate('/')
            }}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            保存設置
          </button>
        </div>
      </main>
    </div>
  )
}

export default TextSettings