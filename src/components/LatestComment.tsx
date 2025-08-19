import React from 'react'
import { MessageCircle, Clock } from 'lucide-react'
import { useStoryStore, Comment } from '../store/storyStore'

export default function LatestComment() {
  const { getLatestComment } = useStoryStore()
  const latestComment = getLatestComment()

  if (!latestComment) {
    return null
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '剛剛'
    if (diffInMinutes < 60) return `${diffInMinutes}分鐘前`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}小時前`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}天前`
  }

  return (
    <section className="py-8 px-4 bg-white/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-700">最新評論 💬</h2>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-100 hover:border-pink-200 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {latestComment.author.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-700">{latestComment.author}</span>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(latestComment.createdAt)}</span>
                </div>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                {latestComment.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}