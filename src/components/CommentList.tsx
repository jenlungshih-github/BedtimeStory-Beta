import React from 'react'
import { MessageSquare, Clock } from 'lucide-react'
import { Comment } from '../store/storyStore'

interface CommentListProps {
  comments: Comment[]
}

export default function CommentList({ comments }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">還沒有評論，成為第一個評論的人吧！</p>
      </div>
    )
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

  // Sort comments by newest first
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
      <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-purple-500" />
        評論 ({comments.length})
      </h3>
      
      <div className="space-y-4">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {comment.author.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-700 text-sm">{comment.author}</span>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {comment.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}