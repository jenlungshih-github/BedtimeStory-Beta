import { Link } from 'react-router-dom'
import { useStoryStore } from '../store/storyStore'
import { Sparkles, BookOpen, Heart } from 'lucide-react'
import PinyinTest from '../components/PinyinTest'

export default function Home() {
  const { storyHistory } = useStoryStore()
  const recentStories = storyHistory.slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center py-12 px-4">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Sparkles className="w-12 h-12 text-pink-400 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            幼兒床邊故事館
          </h1>
          <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          為5歲以下小朋友量身打造的互動故事世界 ✨
        </p>
      </header>

      {/* Quick Start Section */}
      <section className="text-center py-8 px-4">
        <div className="max-w-md mx-auto">
          <Link
            to="/create"
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <BookOpen className="w-8 h-8" />
            開始創作故事
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce">
              <Heart className="w-4 h-4 text-red-500 absolute top-1 left-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Stories Section */}
      {recentStories.length > 0 && (
        <section className="py-12 px-4">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
            最近的故事 📚
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentStories.map((story) => (
              <Link
                key={story.id}
                to={`/story?id=${story.id}`}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-pink-200"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full flex items-center justify-center text-2xl">
                    {story.elements.character === 'rabbit' && '🐰'}
                    {story.elements.character === 'bear' && '🐻'}
                    {story.elements.character === 'cat' && '🐱'}
                    {story.elements.character === 'dog' && '🐶'}
                    {story.elements.character === 'bird' && '🐦'}
                    {story.elements.character === 'fish' && '🐠'}
                    {story.elements.character === 'elephant' && '🐘'}
                    {story.elements.character === 'monkey' && '🐵'}
                    {story.elements.character === 'pig' && '🐷'}
                    {story.elements.character === 'sheep' && '🐑'}
                    {story.elements.character === 'duck' && '🦆'}
                    {story.elements.character === 'mouse' && '🐭'}
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {story.content.substring(0, 50)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-12">
            特色功能 🌟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/create" className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer">
              <h3 className="font-bold text-gray-700 mb-2">選擇角色 場景 主題 情節</h3>
              <p className="text-sm text-gray-600">選擇或創造角色</p>
            </Link>

            <Link to="/voice-settings" className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer">
              <div className="text-4xl mb-4">🔊</div>
              <h3 className="font-bold text-gray-700 mb-2">語音朗讀</h3>
              <p className="text-sm text-gray-600">多種聲音選擇</p>
            </Link>
            <Link to="/text-settings" className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="font-bold text-gray-700 mb-2">學習輔助</h3>
              <p className="text-sm text-gray-600">注音、拼音</p>
            </Link>
            <Link to="/mobile-voice-test" className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer border-2 border-orange-200">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-gray-700 mb-2">移動端測試</h3>
              <p className="text-sm text-gray-600">iPhone語音診斷</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-gray-500">
        <p>讓每個夜晚都有美好的故事陪伴 💤</p>
      </footer>
      
      {/* Debug: Pinyin Test Component */}
      <PinyinTest />
    </div>
  )
}