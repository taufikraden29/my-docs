import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/slices/authSlice'
import { useGetAuthorPostsQuery, useUpdatePostMutation } from '../../store/api/postsApi'
import { formatDate } from '../../utils/slugify'
import { showToast } from '../../utils/toast'

export const DashboardScheduled = () => {
  const user = useSelector(selectCurrentUser)
  const { data: posts, isLoading } = useGetAuthorPostsQuery(user?.id, { skip: !user })
  const [updatePost] = useUpdatePostMutation()

  const scheduledPosts = useMemo(() => {
    if (!posts) return []
    return posts
      .filter(post => post.status === 'scheduled' && post.scheduled_at)
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
  }, [posts])

  const handleCancelSchedule = async (post) => {
    if (window.confirm(`Cancel scheduled publish for "${post.title}"?`)) {
      const toastId = showToast.loading('Cancelling schedule...')
      try {
        await updatePost({
          postId: post.id,
          updates: {
            ...post,
            status: 'draft',
            scheduled_at: null,
          },
        }).unwrap()
        showToast.dismiss(toastId)
        showToast.success('Schedule cancelled successfully!')
      } catch (error) {
        showToast.dismiss(toastId)
        showToast.error('Failed to cancel schedule: ' + error)
      }
    }
  }

  const handlePublishNow = async (post) => {
    if (window.confirm(`Publish "${post.title}" immediately?`)) {
      const toastId = showToast.loading('Publishing post...')
      try {
        await updatePost({
          postId: post.id,
          updates: {
            ...post,
            status: 'published',
            scheduled_at: null,
            published_at: new Date().toISOString(),
          },
        }).unwrap()
        showToast.dismiss(toastId)
        showToast.success('Post published successfully!')
      } catch (error) {
        showToast.dismiss(toastId)
        showToast.error('Failed to publish post: ' + error)
      }
    }
  }

  const getTimeUntilPublish = (scheduledAt) => {
    const now = new Date()
    const scheduled = new Date(scheduledAt)
    const diff = scheduled - now

    if (diff < 0) return 'Overdue'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📅 Scheduled Posts</h1>
        <Link to="/dashboard/posts/new" className="btn-primary">
          Schedule New Post
        </Link>
      </div>

      {scheduledPosts.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No scheduled posts</h3>
          <p className="text-gray-500 mb-4">Schedule posts to publish automatically at a future date</p>
          <Link to="/dashboard/posts/new" className="btn-primary">
            Create & Schedule Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledPosts.map((post) => {
            const isOverdue = new Date(post.scheduled_at) < new Date()
            return (
              <div
                key={post.id}
                className={`card border-2 ${
                  isOverdue ? 'border-red-300 bg-red-50' : 'border-blue-300 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                      {isOverdue && (
                        <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{post.slug}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          Scheduled for:{' '}
                          <span className="font-semibold">
                            {new Date(post.scheduled_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {isOverdue ? 'Overdue' : `In ${getTimeUntilPublish(post.scheduled_at)}`}
                        </span>
                      </div>
                      {post.category && (
                        <span
                          className="inline-block px-2 py-1 text-xs rounded-full text-white"
                          style={{ backgroundColor: post.category.color }}
                        >
                          {post.category.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handlePublishNow(post)}
                      className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Publish Now
                    </button>
                    <Link
                      to={`/dashboard/posts/${post.id}/edit`}
                      className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleCancelSchedule(post)}
                      className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {post.excerpt && (
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">{post.excerpt}</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="card mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">How scheduling works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Scheduled posts will automatically publish at the specified time</li>
              <li>You can edit or cancel scheduled posts before they publish</li>
              <li>Use "Publish Now" to publish a scheduled post immediately</li>
              <li>Check this page regularly to ensure posts publish on time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
