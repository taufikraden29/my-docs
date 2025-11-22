import { useState, useEffect } from 'react'

export const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // Extract headings from markdown content
    const extractHeadings = () => {
      const headingRegex = /^(#{1,3})\s+(.+)$/gm
      const matches = []
      let match

      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length
        const text = match[2]
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
        
        matches.push({
          level,
          text,
          id
        })
      }

      setHeadings(matches)
    }

    if (content) {
      extractHeadings()
    }
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean)
      
      // Find the heading that is currently in view
      let currentActiveId = ''
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i]
        if (element) {
          const rect = element.getBoundingClientRect()
          // Check if element is in viewport (considering navbar height)
          if (rect.top <= 150) {
            currentActiveId = element.id
            break
          }
        }
      }
      
      // If no heading is above threshold, highlight first one if we're at top
      if (!currentActiveId && headingElements.length > 0 && window.scrollY < 100) {
        currentActiveId = headingElements[0].id
      }
      
      if (currentActiveId) {
        setActiveId(currentActiveId)
      }
    }

    // Initial call
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const navbarHeight = 100 // Adjust based on your navbar height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - navbarHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      
      // Update active state immediately for better UX
      setActiveId(id)
    }
  }

  if (headings.length === 0) {
    return (
      <div className="sticky top-24 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span className="text-sm">No headings found</span>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-24 bg-white rounded-lg border border-gray-200 shadow-sm p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span className="text-base">On this page</span>
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={isOpen ? 'Collapse' : 'Expand'}
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          <svg className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <nav className="space-y-1">
          {headings.map((heading, index) => (
            <button
              key={index}
              onClick={() => scrollToHeading(heading.id)}
              className={`block w-full text-left text-sm py-2 px-3 rounded transition-all duration-150 ${
                activeId === heading.id
                  ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent'
              }`}
              style={{ paddingLeft: `${(heading.level - 1) * 0.75 + 0.75}rem` }}
              title={heading.text}
            >
              <span className="line-clamp-2">{heading.text}</span>
            </button>
          ))}
        </nav>
      )}
      
      {!isOpen && (
        <p className="text-xs text-gray-400 mt-2">
          Click to expand {headings.length} {headings.length === 1 ? 'section' : 'sections'}
        </p>
      )}
    </div>
  )
}
