import { Link } from 'react-router-dom'
import { formatDate, truncateText } from '../../utils/slugify'
import { getImageOrDefault } from '../../utils/defaultImages'

export const PostCard = ({ post }) => {
  const imageUrl = getImageOrDefault(post.featured_image, post.category?.name)

  return (
    <article className="card hover:shadow-lg transition-shadow">
      <img
        src={imageUrl}
        alt={post.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      
      <div className="flex items-center gap-2 mb-3">
        {post.category && (
          <span
            className="text-xs px-3 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.name}
          </span>
        )}
        <span className="text-sm text-gray-500">
          {formatDate(post.published_at)}
        </span>
      </div>
      
      <Link to={`/post/${post.slug}`}>
        <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition">
          {post.title}
        </h2>
      </Link>
      
      <p className="text-gray-600 mb-4">
        {truncateText(post.excerpt)}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {post.author?.avatar_url && (
            <img
              src={post.author.avatar_url}
              alt={post.author.username}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm text-gray-700">
            {post.author?.full_name || post.author?.username}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm">{post.view_count || 0}</span>
        </div>
      </div>
    </article>
  )
}
