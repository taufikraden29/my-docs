import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/slugify'
import { getImageOrDefault } from '../../utils/defaultImages'
import { formatReadingTime } from '../../utils/readingTime'

export const FeaturedPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return null

  // Get top 3 most viewed posts
  const featuredPosts = [...posts]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 3)

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              🔥 Featured Posts
            </h2>
            <p className="text-gray-600">
              Most popular articles from our community
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => {
            const imageUrl = getImageOrDefault(post.featured_image, post.category?.name)
            const readingTime = formatReadingTime(post.content || '')

            return (
              <Link
                key={post.id}
                to={`/post/${post.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {post.category && (
                    <span
                      className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full text-white font-medium shadow-lg"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {readingTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {post.view_count || 0}
                      </span>
                    </div>
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
