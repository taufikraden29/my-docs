import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/slices/authSlice'
import { useGetAuthorPostsQuery } from '../../store/api/postsApi'
import { formatDate } from '../../utils/slugify'
import { formatReadingTime } from '../../utils/readingTime'
import { Link } from 'react-router-dom'

export const DashboardAnalytics = () => {
  const user = useSelector(selectCurrentUser)
  const { data: posts, isLoading } = useGetAuthorPostsQuery(user?.id, {
    skip: !user,
  })

  const [dateRange, setDateRange] = useState('30') // days
  const [sortBy, setSortBy] = useState('views')

  const analytics = useMemo(() => {
    if (!posts) return null

    const now = new Date()
    const daysAgo = new Date(now.getTime() - dateRange * 24 * 60 * 60 * 1000)

    const filteredPosts = posts.filter(post => {
      const postDate = new Date(post.created_at)
      return postDate >= daysAgo
    })

    const totalViews = posts.reduce((sum, p) => sum + (p.view_count || 0), 0)
    const totalPosts = posts.length
    const publishedPosts = posts.filter(p => p.status === 'published')
    const avgViewsPerPost = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0

    const topPosts = [...posts]
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 10)

    const categoryStats = posts.reduce((acc, post) => {
      if (post.category) {
        const catName = post.category.name
        if (!acc[catName]) {
          acc[catName] = { count: 0, views: 0, color: post.category.color }
        }
        acc[catName].count++
        acc[catName].views += post.view_count || 0
      }
      return acc
    }, {})

    const viewsByDate = posts.reduce((acc, post) => {
      const date = formatDate(post.created_at)
      if (!acc[date]) {
        acc[date] = { views: 0, posts: 0 }
      }
      acc[date].views += post.view_count || 0
      acc[date].posts++
      return acc
    }, {})

    return {
      totalViews,
      totalPosts,
      publishedCount: publishedPosts.length,
      draftCount: posts.filter(p => p.status === 'draft').length,
      avgViewsPerPost,
      topPosts,
      categoryStats,
      viewsByDate,
      filteredPosts,
    }
  }, [posts, dateRange])

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

  if (!analytics) {
    return (
      <div className="card">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📊 Post Analytics</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
          <option value="99999">All time</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Views</p>
              <p className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Posts</p>
              <p className="text-3xl font-bold">{analytics.totalPosts}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Views/Post</p>
              <p className="text-3xl font-bold">{analytics.avgViewsPerPost}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Published</p>
              <p className="text-3xl font-bold">{analytics.publishedCount}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Posts by Views */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🏆 Top Performing Posts</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-gray-300 rounded-md"
            >
              <option value="views">By Views</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {analytics.topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/dashboard/posts/${post.id}/edit`}
                    className="font-medium text-gray-900 hover:text-blue-600 truncate block"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDate(post.created_at)}</span>
                    <span>•</span>
                    <span>{formatReadingTime(post.content)}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-blue-600">{post.view_count || 0}</div>
                  <div className="text-xs text-gray-500">views</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">📁 Performance by Category</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(analytics.categoryStats)
              .sort((a, b) => b[1].views - a[1].views)
              .map(([category, stats]) => (
                <div key={category} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stats.color }}
                      ></div>
                      <span className="font-medium text-gray-900">{category}</span>
                    </div>
                    <span className="text-sm text-gray-500">{stats.count} posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((stats.views / analytics.totalViews) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {stats.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Engagement Insights */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">💡 Engagement Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="font-semibold text-blue-900">Most Viewed Day</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {Object.entries(analytics.viewsByDate)
                .sort((a, b) => b[1].views - a[1].views)[0]?.[0] || 'N/A'}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              {Object.entries(analytics.viewsByDate)
                .sort((a, b) => b[1].views - a[1].views)[0]?.[1].views.toLocaleString() || 0} views
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-green-900">Avg Reading Time</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(
                posts.reduce((sum, p) => {
                  const words = p.content?.split(/\s+/).length || 0
                  return sum + words / 200
                }, 0) / (posts.length || 1)
              )} min
            </p>
            <p className="text-sm text-green-700 mt-1">Average across all posts</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="font-semibold text-purple-900">Engagement Rate</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {analytics.totalPosts > 0
                ? ((analytics.publishedCount / analytics.totalPosts) * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-sm text-purple-700 mt-1">Posts published vs drafts</p>
          </div>
        </div>
      </div>
    </div>
  )
}
