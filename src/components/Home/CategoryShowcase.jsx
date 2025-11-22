import { Link } from 'react-router-dom'
import { useGetCategoriesWithCountQuery } from '../../store/api/categoriesApi'

export const CategoryShowcase = ({ onCategoryClick }) => {
  const { data: categories = [] } = useGetCategoriesWithCountQuery()

  // Get categories with posts
  const activeCategories = categories
    .filter(cat => (cat.posts?.[0]?.count || 0) > 0)
    .slice(0, 6)

  if (activeCategories.length === 0) return null

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            📚 Explore by Category
          </h2>
          <p className="text-gray-600">
            Browse articles organized by topics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activeCategories.map((category) => {
            const postCount = category.posts?.[0]?.count || 0

            return (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-center group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  {postCount} {postCount === 1 ? 'post' : 'posts'}
                </p>
              </button>
            )
          })}
        </div>

        {categories.length > 6 && (
          <div className="text-center mt-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              View All Categories
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
