import React, { useState } from 'react'
import { Send, User } from 'lucide-react'
import { useStoryStore } from '../store/storyStore'
import { usePopup } from '../contexts/PopupContext'

interface AddCommentProps {
  storyId: string
}

export default function AddComment({ storyId }: AddCommentProps) {
  const [comment, setComment] = useState('')
  const [author, setAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addComment } = useStoryStore()
  const { showToast } = usePopup()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim() || !author.trim()) {
      showToast('error', '請填寫評論內容和您的名字')
      return
    }

    setIsSubmitting(true)
    
    try {
      addComment(storyId, comment.trim(), author.trim())
      setComment('')
      showToast('success', '評論已發表！')
    } catch (error) {
      showToast('error', '發表評論時出現錯誤')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
      <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
        <Send className="w-5 h-5 text-blue-500" />
        發表評論
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            您的名字
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="請輸入您的名字"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            評論內容
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="分享您對這個故事的想法..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={200}
            disabled={isSubmitting}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {comment.length}/200
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!comment.trim() || !author.trim() || isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              發表中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              發表評論
            </>
          )}
        </button>
      </form>
    </div>
  )
}