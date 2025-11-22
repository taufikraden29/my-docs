import { useState, useEffect, useMemo } from 'react'

export const SEOHelper = ({ title, content, excerpt, slug }) => {
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [metaKeywords, setMetaKeywords] = useState('')

  useEffect(() => {
    if (title && !metaTitle) {
      setMetaTitle(title)
    }
    if (excerpt && !metaDescription) {
      setMetaDescription(excerpt)
    }
  }, [title, excerpt])

  const seoAnalysis = useMemo(() => {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      passed: [],
    }

    // Title checks
    if (!metaTitle) {
      analysis.issues.push('Meta title is missing')
    } else {
      if (metaTitle.length < 30) {
        analysis.issues.push('Meta title is too short (min 30 characters)')
      } else if (metaTitle.length > 60) {
        analysis.issues.push('Meta title is too long (max 60 characters)')
      } else {
        analysis.passed.push('Meta title length is optimal')
        analysis.score += 20
      }

      if (focusKeyword && metaTitle.toLowerCase().includes(focusKeyword.toLowerCase())) {
        analysis.passed.push('Focus keyword found in meta title')
        analysis.score += 15
      } else if (focusKeyword) {
        analysis.suggestions.push('Add focus keyword to meta title')
      }
    }

    // Description checks
    if (!metaDescription) {
      analysis.issues.push('Meta description is missing')
    } else {
      if (metaDescription.length < 120) {
        analysis.issues.push('Meta description is too short (min 120 characters)')
      } else if (metaDescription.length > 160) {
        analysis.issues.push('Meta description is too long (max 160 characters)')
      } else {
        analysis.passed.push('Meta description length is optimal')
        analysis.score += 20
      }

      if (focusKeyword && metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) {
        analysis.passed.push('Focus keyword found in meta description')
        analysis.score += 15
      } else if (focusKeyword) {
        analysis.suggestions.push('Add focus keyword to meta description')
      }
    }

    // Content checks
    if (content) {
      const wordCount = content.split(/\s+/).length
      if (wordCount < 300) {
        analysis.suggestions.push('Content is short. Consider adding more (min 300 words)')
      } else {
        analysis.passed.push(`Good content length (${wordCount} words)`)
        analysis.score += 10
      }

      if (focusKeyword) {
        const keywordCount = (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length
        const keywordDensity = (keywordCount / wordCount) * 100

        if (keywordCount === 0) {
          analysis.issues.push('Focus keyword not found in content')
        } else if (keywordDensity < 0.5) {
          analysis.suggestions.push('Focus keyword density is low (use it more naturally)')
        } else if (keywordDensity > 2.5) {
          analysis.issues.push('Focus keyword density is too high (avoid keyword stuffing)')
        } else {
          analysis.passed.push(`Good keyword density (${keywordDensity.toFixed(2)}%)`)
          analysis.score += 15
        }
      }

      // Check for headings
      const hasH1 = content.includes('# ')
      const hasH2 = content.includes('## ')
      
      if (hasH1) {
        analysis.passed.push('Content has H1 heading')
        analysis.score += 5
      } else {
        analysis.suggestions.push('Add H1 heading to content')
      }

      if (hasH2) {
        analysis.passed.push('Content has H2 headings')
        analysis.score += 5
      } else {
        analysis.suggestions.push('Add H2 headings for better structure')
      }
    }

    // Slug checks
    if (slug) {
      if (slug.length > 75) {
        analysis.issues.push('URL slug is too long (max 75 characters)')
      } else {
        analysis.passed.push('URL slug length is good')
        analysis.score += 5
      }

      if (focusKeyword && slug.toLowerCase().includes(focusKeyword.toLowerCase().replace(/\s+/g, '-'))) {
        analysis.passed.push('Focus keyword found in URL')
        analysis.score += 10
      } else if (focusKeyword) {
        analysis.suggestions.push('Add focus keyword to URL slug')
      }
    }

    return analysis
  }, [metaTitle, metaDescription, content, slug, focusKeyword])

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-300'
    if (score >= 50) return 'bg-yellow-100 border-yellow-300'
    return 'bg-red-100 border-red-300'
  }

  return (
    <div className="card border-2 border-green-100 bg-green-50/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="font-semibold text-gray-900">🔍 SEO Optimization</h3>
        </div>
        <div className={`px-3 py-1 rounded-lg border-2 ${getScoreBg(seoAnalysis.score)}`}>
          <span className={`text-lg font-bold ${getScoreColor(seoAnalysis.score)}`}>
            {seoAnalysis.score}/100
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Focus Keyword */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Focus Keyword
          </label>
          <input
            type="text"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            className="input-field"
            placeholder="Enter your target keyword"
          />
          <p className="text-xs text-gray-500 mt-1">
            The main keyword you want this post to rank for
          </p>
        </div>

        {/* Meta Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
            <span className="ml-2 text-xs text-gray-500">
              ({metaTitle.length}/60)
            </span>
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="input-field"
            placeholder="Enter SEO title"
            maxLength={60}
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
            <span className="ml-2 text-xs text-gray-500">
              ({metaDescription.length}/160)
            </span>
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="textarea-field"
            placeholder="Enter SEO description"
            rows="3"
            maxLength={160}
          />
        </div>

        {/* Meta Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            className="input-field"
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>

        {/* Search Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Engine Preview
          </label>
          <div className="p-4 bg-white rounded-lg border border-gray-300">
            <div className="text-xs text-green-600 mb-1">
              https://yoursite.com/post/{slug || 'post-slug'}
            </div>
            <div className="text-lg text-blue-600 hover:underline cursor-pointer mb-1">
              {metaTitle || title || 'Your Post Title'}
            </div>
            <div className="text-sm text-gray-600">
              {metaDescription || excerpt || 'Your post description will appear here...'}
            </div>
          </div>
        </div>

        {/* SEO Analysis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            SEO Analysis
          </label>

          {/* Passed Checks */}
          {seoAnalysis.passed.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-green-700 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Good ({seoAnalysis.passed.length})
              </div>
              <ul className="space-y-1">
                {seoAnalysis.passed.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          {seoAnalysis.issues.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-red-700 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Issues ({seoAnalysis.issues.length})
              </div>
              <ul className="space-y-1">
                {seoAnalysis.issues.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {seoAnalysis.suggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-yellow-700 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Improvements ({seoAnalysis.suggestions.length})
              </div>
              <ul className="space-y-1">
                {seoAnalysis.suggestions.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <svg className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
