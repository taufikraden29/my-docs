import { useParams } from 'react-router-dom'
import { useGetPostBySlugQuery } from '../../store/api/postsApi'
import { MainLayout } from '../../components/Layout/MainLayout'
import { MarkdownContent } from '../../components/Post/MarkdownContent'
import { formatDate } from '../../utils/slugify'
import { getImageOrDefault } from '../../utils/defaultImages'
import { formatReadingTime } from '../../utils/readingTime'
import { ReadingProgressBar } from '../../components/Reader/ReadingProgressBar'
import { ScrollToTop } from '../../components/Reader/ScrollToTop'
import { TableOfContents } from '../../components/Reader/TableOfContents'
import { ShareButtons } from '../../components/Reader/ShareButtons'

export const PostDetailPage = () => {
  const { slug } = useParams()

  const { data: post, isLoading } = useGetPostBySlugQuery(slug)
  
  const imageUrl = post ? getImageOrDefault(post.featured_image, post.category?.name) : null

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="h-64 bg-gray-300 rounded mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-700">Post not found</h2>
        </div>
      </MainLayout>
    )
  }

  const readingTime = post ? formatReadingTime(post.content) : ''

  return (
    <MainLayout>
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />

      <article className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="mb-8">
                {post.category && (
                  <span
                    className="inline-block text-sm px-3 py-1 rounded-full text-white font-medium mb-4"
                    style={{ backgroundColor: post.category.color }}
                  >
                    {post.category.name}
                  </span>
                )}

                <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

                <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    {post.author?.avatar_url && (
                      <img
                        src={post.author.avatar_url}
                        alt={post.author.username}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <span className="font-medium">
                      {post.author?.full_name || post.author?.username}
                    </span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(post.published_at)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{readingTime}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{post.view_count || 0} views</span>
                  </div>
                </div>
              </div>

              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg mb-8"
              />

              <MarkdownContent content={post.content} />

              {/* Share Buttons */}
              <div className="mt-8">
                <ShareButtons 
                  title={post.title}
                  url={window.location.href}
                />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tagWrapper) => (
                      <span
                        key={tagWrapper.tag.id}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
                      >
                        #{tagWrapper.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Table of Contents */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
