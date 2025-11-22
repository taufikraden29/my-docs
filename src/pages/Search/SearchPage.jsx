import { useState } from 'react'
import { useSearchPostsQuery } from '../../store/api/postsApi'
import { MainLayout } from '../../components/Layout/MainLayout'
import { PostList } from '../../components/Post/PostList'

export const SearchPage = () => {
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: posts, isLoading } = useSearchPostsQuery(searchTerm, {
    skip: searchTerm.length === 0,
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchTerm(query)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-6 text-center">Search Posts</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field flex-1"
              placeholder="Search by title or content..."
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>
        </div>

        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              {isLoading ? 'Searching...' : `Found ${posts?.length || 0} result(s) for "${searchTerm}"`}
            </p>
          </div>
        )}

        {searchTerm && <PostList posts={posts} loading={isLoading} />}

        {!searchTerm && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Searching</h3>
            <p className="text-gray-500">Enter a keyword to find posts</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
