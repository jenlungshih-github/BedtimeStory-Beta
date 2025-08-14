import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStoryStore } from '../store/storyStore'
import { generateStory } from '../services/storyService'
import { ArrowLeft, Sparkles, Plus, X, Shuffle } from 'lucide-react'
import { toast } from 'sonner'
import { usePopup } from '../contexts/PopupContext'

const characters = [
  { id: 'rabbit', name: '小兔子', emoji: '🐰', color: 'bg-pink-100 hover:bg-pink-200' },
  { id: 'bear', name: '小熊', emoji: '🐻', color: 'bg-amber-100 hover:bg-amber-200' },
  { id: 'cat', name: '小貓', emoji: '🐱', color: 'bg-orange-100 hover:bg-orange-200' },
  { id: 'dog', name: '小狗', emoji: '🐶', color: 'bg-yellow-100 hover:bg-yellow-200' },
  { id: 'bird', name: '小鳥', emoji: '🐦', color: 'bg-blue-100 hover:bg-blue-200' },
  { id: 'fish', name: '小魚', emoji: '🐠', color: 'bg-cyan-100 hover:bg-cyan-200' },
  { id: 'elephant', name: '小象', emoji: '🐘', color: 'bg-gray-100 hover:bg-gray-200' },
  { id: 'monkey', name: '小猴子', emoji: '🐵', color: 'bg-green-100 hover:bg-green-200' },
  { id: 'pig', name: '小豬', emoji: '🐷', color: 'bg-pink-100 hover:bg-pink-200' },
  { id: 'sheep', name: '小羊', emoji: '🐑', color: 'bg-white hover:bg-gray-50' },
  { id: 'duck', name: '小鴨', emoji: '🦆', color: 'bg-yellow-100 hover:bg-yellow-200' },
  { id: 'mouse', name: '小老鼠', emoji: '🐭', color: 'bg-gray-100 hover:bg-gray-200' }
]

const scenes = [
  { id: 'forest', name: '森林', emoji: '🌲', color: 'bg-green-100 hover:bg-green-200' },
  { id: 'ocean', name: '海邊', emoji: '🌊', color: 'bg-blue-100 hover:bg-blue-200' },
  { id: 'garden', name: '花園', emoji: '🌸', color: 'bg-pink-100 hover:bg-pink-200' },
  { id: 'castle', name: '城堡', emoji: '🏰', color: 'bg-purple-100 hover:bg-purple-200' },
  { id: 'farm', name: '農場', emoji: '🚜', color: 'bg-yellow-100 hover:bg-yellow-200' },
  { id: 'space', name: '太空', emoji: '🚀', color: 'bg-indigo-100 hover:bg-indigo-200' },
  { id: 'rainbow', name: '彩虹橋', emoji: '🌈', color: 'bg-gradient-to-r from-red-100 to-purple-100 hover:from-red-200 hover:to-purple-200' },
  { id: 'magic_forest', name: '魔法森林', emoji: '✨', color: 'bg-emerald-100 hover:bg-emerald-200' }
]

const themes = [
  { id: 'friendship', name: '友誼', emoji: '🤝', color: 'bg-pink-100 hover:bg-pink-200' },
  { id: 'courage', name: '勇氣', emoji: '💪', color: 'bg-red-100 hover:bg-red-200' },
  { id: 'sharing', name: '分享', emoji: '🎁', color: 'bg-green-100 hover:bg-green-200' },
  { id: 'helping', name: '幫助他人', emoji: '🤲', color: 'bg-blue-100 hover:bg-blue-200' },
  { id: 'adventure', name: '探險', emoji: '🗺️', color: 'bg-orange-100 hover:bg-orange-200' },
  { id: 'learning', name: '學習新技能', emoji: '📚', color: 'bg-purple-100 hover:bg-purple-200' }
]

const plots = [
  { id: 'difficulty', name: '遇到困難', emoji: '⛰️', color: 'bg-gray-100 hover:bg-gray-200' },
  { id: 'treasure', name: '找到寶藏', emoji: '💎', color: 'bg-yellow-100 hover:bg-yellow-200' },
  { id: 'friend', name: '結交新朋友', emoji: '👫', color: 'bg-pink-100 hover:bg-pink-200' },
  { id: 'skill', name: '學會新本領', emoji: '🎯', color: 'bg-green-100 hover:bg-green-200' }
]

export default function StoryCreator() {
  const { showToast } = usePopup()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { selectedElements, setSelectedElement, setCurrentStory, addToHistory } = useStoryStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [customCharacters, setCustomCharacters] = useState([])
  const [showAddCharacterModal, setShowAddCharacterModal] = useState(false)
  const [newCharacter, setNewCharacter] = useState({ name: '', emoji: '', color: 'bg-pink-100 hover:bg-pink-200' })
  // Removed showCharacterSelection and randomCharacters as they're no longer needed

  // Load custom characters from localStorage on component mount
  useEffect(() => {
    const savedCharacters = localStorage.getItem('customCharacters')
    if (savedCharacters) {
      try {
        const parsedCharacters = JSON.parse(savedCharacters)
        setCustomCharacters(parsedCharacters)
      } catch (error) {
        console.error('Failed to parse saved characters:', error)
        localStorage.removeItem('customCharacters')
      }
    }
  }, [])

  // Handle character pre-selection from URL params
  useEffect(() => {
    const characterParam = searchParams.get('character')
    if (characterParam) {
      setSelectedElement('character', characterParam)
    }
    // Skip character selection modal - go directly to story creation
  }, [searchParams, setSelectedElement])

  // Save custom characters to localStorage whenever they change
  useEffect(() => {
    if (customCharacters.length > 0) {
      localStorage.setItem('customCharacters', JSON.stringify(customCharacters))
    } else {
      localStorage.removeItem('customCharacters')
    }
  }, [customCharacters])

  // Debug logging
  console.log('StoryCreator rendered, showAddCharacterModal:', showAddCharacterModal)

  // Available emojis for character creation
  const availableEmojis = ['🦁', '🐯', '🐨', '🐼', '🦊', '🐺', '🐸', '🐢', '🦋', '🐝', '🦜', '🐧', '🦆', '🐳', '🐙', '🦀', '🐌', '🦔', '🐿️', '🦘']
  const availableColors = [
    'bg-pink-100 hover:bg-pink-200',
    'bg-blue-100 hover:bg-blue-200',
    'bg-green-100 hover:bg-green-200',
    'bg-yellow-100 hover:bg-yellow-200',
    'bg-purple-100 hover:bg-purple-200',
    'bg-orange-100 hover:bg-orange-200',
    'bg-red-100 hover:bg-red-200',
    'bg-indigo-100 hover:bg-indigo-200'
  ]

  // Combine default and custom characters
  const allCharacters = [...characters, ...customCharacters]

  // Removed character selection modal functions as they're no longer needed

  const handleElementSelect = (category: keyof typeof selectedElements, value: string) => {
    setSelectedElement(category, value)
  }

  const handleAddCharacter = () => {
    if (!newCharacter.name.trim() || !newCharacter.emoji) {
      showToast('error', '請填寫角色名稱並選擇表情符號！')
      return
    }

    const characterId = `custom_${Date.now()}`
    const character = {
      id: characterId,
      name: newCharacter.name.trim(),
      emoji: newCharacter.emoji,
      color: newCharacter.color
    }

    setCustomCharacters(prev => [...prev, character])
    setNewCharacter({ name: '', emoji: '', color: 'bg-pink-100 hover:bg-pink-200' })
    setShowAddCharacterModal(false)
    showToast('success', `成功添加角色「${character.name}」！`)
  }

  const handleRemoveCustomCharacter = (characterId: string) => {
    setCustomCharacters(prev => prev.filter(char => char.id !== characterId))
    // If the removed character was selected, clear the selection
    if (selectedElements.character === characterId) {
      setSelectedElement('character', '')
    }
    showToast('success', '角色已移除！')
  }

  // Function to randomly select all story elements
  const handleRandomSelection = () => {
    const randomCharacter = allCharacters[Math.floor(Math.random() * allCharacters.length)]
    const randomScene = scenes[Math.floor(Math.random() * scenes.length)]
    const randomTheme = themes[Math.floor(Math.random() * themes.length)]
    const randomPlot = plots[Math.floor(Math.random() * plots.length)]
    
    setSelectedElement('character', randomCharacter.id)
    setSelectedElement('scene', randomScene.id)
    setSelectedElement('theme', randomTheme.id)
    setSelectedElement('plot', randomPlot.id)
    
    showToast('success', '已隨機選擇故事元素！您可以修改任何選項。')
  }

  const handleGenerateStory = async () => {
    const { character, scene, theme, plot } = selectedElements
    
    if (!character || !scene || !theme || !plot) {
      showToast('error', '請選擇所有故事元素！')
      return
    }

    setIsGenerating(true)
    
    try {
      // Find the character name for custom characters
      const selectedCharacter = allCharacters.find(char => char.id === character)
      const customCharacterName = selectedCharacter?.id.startsWith('custom_') ? selectedCharacter.name : undefined
      
      const story = generateStory({
        character,
        scene,
        theme,
        plot
      }, customCharacterName)
      
      // Check Zhuyin coverage
      if (story.zhuyinCheck && !story.zhuyinCheck.hasFullCoverage) {
        const missingCount = story.zhuyinCheck.missingChars.length
        const missingChars = story.zhuyinCheck.missingChars.join('、')
        
        showToast('info', `注音映射表檢查：發現 ${missingCount} 個字符缺少注音標記\n缺少的字符：${missingChars}\n\n故事已生成，但部分字符可能無法顯示注音。`)
      } else if (story.zhuyinCheck?.hasFullCoverage) {
        showToast('success', '故事生成成功！所有字符都有完整的注音標記。')
      } else {
        showToast('success', '故事生成成功！')
      }
      
      setCurrentStory(story)
      addToHistory(story)
      
      navigate('/story')
    } catch (error) {
      showToast('error', '故事生成失敗，請重試')
    } finally {
      setIsGenerating(false)
    }
  }

  const isComplete = selectedElements.character && selectedElements.scene && selectedElements.theme && selectedElements.plot

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/"
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-700">創作你的故事 ✨</h1>
        </div>
        <p className="text-gray-600 text-center">
          選擇你喜歡的故事元素，讓我們一起創造美妙的故事！
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Random Selection Button - Moved to Top */}
        <section className="text-center py-4">
          <button
            onClick={handleRandomSelection}
            disabled={isGenerating}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform ${
              !isGenerating
                ? 'bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Shuffle className="w-6 h-6" />
            隨機選擇故事元素
          </button>
          <p className="text-gray-500 mt-2 text-sm">
            讓我們為您隨機選擇主角、場景、主題和情節
          </p>
        </section>

        {/* Character Selection */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            選擇主角 🎭
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" style={{ position: 'relative' }}>
            {allCharacters.map((char) => (
              <div key={char.id} className="relative group">
                <button
                  onClick={() => handleElementSelect('character', char.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedElements.character === char.id
                      ? 'border-pink-400 bg-pink-50 shadow-lg'
                      : 'border-gray-200 hover:border-pink-300'
                  } ${char.color}`}
                >
                  <div className="text-4xl mb-2">{char.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">{char.name}</div>
                </button>
                {char.id.startsWith('custom_') && (
                  <button
                    onClick={() => handleRemoveCustomCharacter(char.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {/* Add Character Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Add character button clicked!')
                setShowAddCharacterModal(true)
              }}
              className="p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-pink-300 bg-gray-50 hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center cursor-pointer"
              style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
              aria-label="添加新角色"
            >
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <div className="text-sm font-medium text-gray-500">添加角色</div>
            </button>
          </div>
        </section>

        {/* Scene Selection */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            選擇場景 🏞️
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scenes.map((scene) => (
              <button
                key={scene.id}
                onClick={() => handleElementSelect('scene', scene.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedElements.scene === scene.id
                    ? 'border-blue-400 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                } ${scene.color}`}
              >
                <div className="text-4xl mb-2">{scene.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{scene.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Theme Selection */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            選擇主題 💝
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleElementSelect('theme', theme.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedElements.theme === theme.id
                    ? 'border-green-400 bg-green-50 shadow-lg'
                    : 'border-gray-200 hover:border-green-300'
                } ${theme.color}`}
              >
                <div className="text-4xl mb-2">{theme.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{theme.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Plot Selection */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            選擇情節 📖
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {plots.map((plot) => (
              <button
                key={plot.id}
                onClick={() => handleElementSelect('plot', plot.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedElements.plot === plot.id
                    ? 'border-purple-400 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300'
                } ${plot.color}`}
              >
                <div className="text-4xl mb-2">{plot.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{plot.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="text-center py-8">
          {/* Generate Story Button */}
          <div>
            <button
              onClick={handleGenerateStory}
              disabled={!isComplete || isGenerating}
              className={`inline-flex items-center gap-3 px-12 py-6 rounded-full text-2xl font-bold transition-all duration-300 transform ${
                isComplete && !isGenerating
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-8 h-8" />
                  生成我的故事
                </>
              )}
            </button>
            {!isComplete && (
              <p className="text-gray-500 mt-4">
                請選擇所有故事元素後再生成故事
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Add Character Modal */}
      {showAddCharacterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-700">添加新角色 ✨</h3>
              <button
                onClick={() => setShowAddCharacterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Character Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色名稱
                </label>
                <input
                  type="text"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="例如：小龍、小公主"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                  maxLength={10}
                />
              </div>

              {/* Emoji Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  選擇表情符號
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                  {availableEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewCharacter(prev => ({ ...prev, emoji }))}
                      className={`p-3 rounded-lg text-2xl transition-all hover:scale-110 ${
                        newCharacter.emoji === emoji
                          ? 'bg-pink-100 ring-2 ring-pink-400'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  選擇顏色主題
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCharacter(prev => ({ ...prev, color }))}
                      className={`h-12 rounded-lg transition-all hover:scale-105 ${
                        newCharacter.color === color
                          ? 'ring-2 ring-gray-400'
                          : ''
                      } ${color.split(' ')[0]}`}
                    >
                      {newCharacter.color === color && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {newCharacter.name && newCharacter.emoji && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    預覽
                  </label>
                  <div className={`p-4 rounded-2xl border-2 border-gray-200 ${newCharacter.color} inline-block`}>
                    <div className="text-4xl mb-2">{newCharacter.emoji}</div>
                    <div className="text-sm font-medium text-gray-700">{newCharacter.name}</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddCharacterModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCharacter}
                  disabled={!newCharacter.name.trim() || !newCharacter.emoji}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                    newCharacter.name.trim() && newCharacter.emoji
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  添加角色
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character Selection Modal removed - users go directly to story creation */}
    </div>
  )
}