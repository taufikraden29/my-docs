import { Link } from 'react-router-dom'

export const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community and share your knowledge with developers around the world.
            Create, publish, and grow your audience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Start Writing Today
            </Link>
            
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Articles
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl mb-2">✍️</div>
              <h3 className="font-semibold mb-1">Write & Publish</h3>
              <p className="text-sm text-blue-100">
                Create beautiful articles with our markdown editor
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-semibold mb-1">Grow Audience</h3>
              <p className="text-sm text-blue-100">
                Share your knowledge and build your following
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl mb-2">💡</div>
              <h3 className="font-semibold mb-1">Learn Together</h3>
              <p className="text-sm text-blue-100">
                Connect with developers and share insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
