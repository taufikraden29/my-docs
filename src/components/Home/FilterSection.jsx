import { useState } from 'react'
import { useGetCategoriesWithCountQuery } from '../../store/api/categoriesApi'
import { useGetTagsWithCountQuery } from '../../store/api/tagsApi'

export const FilterSection = ({ onFilterChange, activeFilters }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)

  const { data: categories = [] } = useGetCategoriesWithCountQuery()
  const { data: tags = [] } = useGetTagsWithCountQuery()

  // Filter only categories and tags that have posts
  const categoriesWithPosts = categories.filter(cat => {
    const count = cat.posts?.[0]?.count || 0
    return count > 0
  })

  const tagsWithPosts = tags.filter(tag => {
    const count = tag.post_tags?.[0]?.count || 0
    return count > 0
  })

  // Show limited items initially
  const displayedCategories = showAllCategories 
    ? categoriesWithPosts 
    : categoriesWithPosts.slice(0, 5)
  
  const displayedTags = showAllTags 
    ? tagsWithPosts 
    : tagsWithPosts.slice(0, 8)

  const handleCategoryClick = (categoryId) => {
    onFilterChange({
      type: 'category',
      value: categoryId === activeFilters.category ? null : categoryId
    })
  }

  const handleTagClick = (tagId) => {
    onFilterChange({
      type: 'tag',
      value: tagId === activeFilters.tag ? null : tagId
    })
  }

  const handleClearFilters = () => {
    onFilterChange({ type: 'clear' })
  }

  const hasActiveFilters = activeFilters.category || activeFilters.tag

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-24">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="font-semibold text-gray-900">Filter Posts</h3>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            <svg className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear all filters
          </button>
        )}
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
            </h4>
            
            {categoriesWithPosts.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No categories available</p>
            ) : (
              <>
                <div className="space-y-2">
                  {displayedCategories.map((category) => {
                    const postCount = category.posts?.[0]?.count || 0
                    const isActive = activeFilters.category === category.id

                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-medium ring-2 ring-blue-200'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm">{category.name}</span>
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {postCount}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {categoriesWithPosts.length > 5 && (
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="mt-2 w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showAllCategories ? 'Show less' : `Show all (${categoriesWithPosts.length})`}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Tags
            </h4>

            {tagsWithPosts.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No tags available</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {displayedTags.map((tag) => {
                    const postCount = tag.post_tags?.[0]?.count || 0
                    const isActive = activeFilters.tag === tag.id

                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>#{tag.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {postCount}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {tagsWithPosts.length > 8 && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="mt-2 w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showAllTags ? 'Show less' : `Show all (${tagsWithPosts.length})`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
