import { useState, useMemo, useRef } from 'react'
import { useGetAllPublishedPostsQuery } from '../../store/api/postsApi'
import { MainLayout } from '../../components/Layout/MainLayout'
import { PostList } from '../../components/Post/PostList'
import { FilterSection } from '../../components/Home/FilterSection'
import { StatsSection } from '../../components/Home/StatsSection'
import { FeaturedPosts } from '../../components/Home/FeaturedPosts'
import { CategoryShowcase } from '../../components/Home/CategoryShowcase'
import { CTASection } from '../../components/Home/CTASection'

export const HomePage = () => {
  const { data: posts, isLoading } = useGetAllPublishedPostsQuery()
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    tag: null
  })
  const allPostsRef = useRef(null)

  // Filter posts based on active filters
  const filteredPosts = useMemo(() => {
    if (!posts) return []

    let filtered = [...posts]

    // Filter by category
    if (activeFilters.category) {
      filtered = filtered.filter(post => post.category?.id === activeFilters.category)
    }

    // Filter by tag
    if (activeFilters.tag) {
      filtered = filtered.filter(post => 
        post.tags?.some(tagWrapper => tagWrapper.tag?.id === activeFilters.tag)
      )
    }

    return filtered
  }, [posts, activeFilters])

  const handleFilterChange = ({ type, value }) => {
    if (type === 'clear') {
      setActiveFilters({ category: null, tag: null })
    } else if (type === 'category') {
      setActiveFilters(prev => ({ ...prev, category: value }))
    } else if (type === 'tag') {
      setActiveFilters(prev => ({ ...prev, tag: value }))
    }
    
    // Scroll to posts section
    setTimeout(() => {
      allPostsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleCategoryClick = (categoryId) => {
    setActiveFilters(prev => ({
      ...prev,
      category: categoryId === prev.category ? null : categoryId
    }))
    setTimeout(() => {
      allPostsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const hasActiveFilters = activeFilters.category || activeFilters.tag
  const resultCount = filteredPosts.length

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              🎉 Welcome to MyDoc Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Share Knowledge,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                Inspire Developers
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your personal documentation and blog platform. Write, publish, and share your expertise with a growing community of developers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => allPostsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Explore Articles
              </button>
              <a
                href="#stats"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                View Statistics
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats">
        <StatsSection />
      </div>

      {/* Featured Posts */}
      <FeaturedPosts posts={posts} />

      {/* Category Showcase */}
      <CategoryShowcase onCategoryClick={handleCategoryClick} />

      {/* All Posts Section */}
      <div ref={allPostsRef} className="scroll-mt-24 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar - Filters */}
            <aside className="lg:col-span-3">
              <FilterSection 
                onFilterChange={handleFilterChange}
                activeFilters={activeFilters}
              />
            </aside>

            {/* Main Content - Posts */}
            <main className="lg:col-span-9">
            <div className="mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-3xl font-bold">
                  {hasActiveFilters ? 'Filtered Posts' : 'Latest Posts'}
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">{resultCount} {resultCount === 1 ? 'post' : 'posts'}</span>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {activeFilters.category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Category
                      <button
                        onClick={() => handleFilterChange({ type: 'category', value: null })}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {activeFilters.tag && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      Tag
                      <button
                        onClick={() => handleFilterChange({ type: 'tag', value: null })}
                        className="hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Posts List */}
            {filteredPosts.length === 0 && !isLoading ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters to see more posts.</p>
                {hasActiveFilters && (
                  <button
                    onClick={() => handleFilterChange({ type: 'clear' })}
                    className="btn-primary"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <PostList posts={filteredPosts} loading={isLoading} />
            )}
            </main>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />
    </MainLayout>
  )
}
