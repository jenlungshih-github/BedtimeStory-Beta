import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface Character {
  id: string
  name: string
  emoji: string
  description: string
}

const characters: Character[] = [
  { id: 'rabbit', name: '小兔子', emoji: '🐰', description: '活潑可愛的小兔子，喜歡蹦蹦跳跳' },
  { id: 'bear', name: '小熊', emoji: '🐻', description: '溫暖友善的小熊，最愛擁抱' },
  { id: 'cat', name: '小貓咪', emoji: '🐱', description: '優雅聰明的小貓，喜歡探索' },
  { id: 'dog', name: '小狗狗', emoji: '🐶', description: '忠誠勇敢的小狗，最佳的朋友' },
  { id: 'bird', name: '小鳥', emoji: '🐦', description: '自由飛翔的小鳥，歌聲動聽' },
  { id: 'fish', name: '小魚', emoji: '🐠', description: '游泳高手小魚，住在美麗的海洋' },
  { id: 'elephant', name: '小象', emoji: '🐘', description: '聰明善良的小象，記憶力超強' },
  { id: 'monkey', name: '小猴子', emoji: '🐵', description: '調皮機靈的小猴，愛爬樹玩耍' },
  { id: 'pig', name: '小豬', emoji: '🐷', description: '可愛圓滾的小豬，喜歡在泥巴裡打滾' },
  { id: 'sheep', name: '小羊', emoji: '🐑', description: '溫順可愛的小羊，毛茸茸很舒服' },
  { id: 'duck', name: '小鴨子', emoji: '🦆', description: '會游泳的小鴨，嘎嘎叫很可愛' },
  { id: 'mouse', name: '小老鼠', emoji: '🐭', description: '小巧靈活的老鼠，很會找東西' }
]

export default function CharacterSelection() {
  const navigate = useNavigate()

  const handleCharacterSelect = (character: Character) => {
    // 跳轉到故事創作頁面，並預填角色
    navigate(`/create?character=${character.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回首頁
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            選擇你的故事角色
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            選擇一個可愛的角色來開始你的故事冒險吧！ ✨
          </p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => handleCharacterSelect(character)}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-pink-200 text-center"
            >
              <div className="text-6xl mb-4 group-hover:animate-bounce">
                {character.emoji}
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                {character.name}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {character.description}
              </p>
            </button>
          ))}
        </div>

        {/* Create Custom Character */}
        <div className="text-center mt-12">
          <Link
            to="/create"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            ✨ 創造自己的角色
          </Link>
        </div>
      </div>
    </div>
  )
}