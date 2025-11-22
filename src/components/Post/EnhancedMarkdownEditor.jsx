import { useState, useRef, useEffect } from 'react'
import { MarkdownContent } from './MarkdownContent'
import { formatReadingTime, getWordCount } from '../../utils/readingTime'

export const EnhancedMarkdownEditor = ({ value, onChange, error }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const textareaRef = useRef(null)
  
  const charCount = value?.length || 0
  const wordCount = getWordCount(value)
  const readingTime = formatReadingTime(value)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea && !isFullscreen) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.max(textarea.scrollHeight, 400) + 'px'
    }
  }, [value, isFullscreen])

  // Handle Tab key
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
      }, 0)
    }
  }

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isFullscreen])

  // Quick insert templates
  const insertTemplate = (template) => {
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    let newText = ''
    let cursorOffset = 0

    switch (template) {
      case 'code-js':
        newText = `\`\`\`javascript\n${selectedText || '// Your code here'}\n\`\`\``
        cursorOffset = selectedText ? newText.length : 16
        break
      case 'code-py':
        newText = `\`\`\`python\n${selectedText || '# Your code here'}\n\`\`\``
        cursorOffset = selectedText ? newText.length : 14
        break
      case 'code-html':
        newText = `\`\`\`html\n${selectedText || '<!-- Your code here -->'}\n\`\`\``
        cursorOffset = selectedText ? newText.length : 12
        break
      case 'code-css':
        newText = `\`\`\`css\n${selectedText || '/* Your code here */'}\n\`\`\``
        cursorOffset = selectedText ? newText.length : 11
        break
      case 'inline-code':
        newText = `\`${selectedText || 'code'}\``
        cursorOffset = selectedText ? newText.length : 1
        break
      case 'heading':
        newText = `## ${selectedText || 'Heading'}`
        cursorOffset = newText.length
        break
      case 'list':
        newText = `- ${selectedText || 'List item'}`
        cursorOffset = newText.length
        break
      case 'blockquote':
        newText = `> ${selectedText || 'Quote text'}`
        cursorOffset = newText.length
        break
      default:
        return
    }

    const newValue = value.substring(0, start) + newText + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      if (selectedText) {
        textarea.selectionStart = start
        textarea.selectionEnd = start + newText.length
      } else {
        textarea.selectionStart = textarea.selectionEnd = start + cursorOffset
      }
    }, 0)
  }

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}>
      <div className={isFullscreen ? 'h-full flex flex-col p-6' : ''}>
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Insert Buttons */}
            <button
              type="button"
              onClick={() => insertTemplate('code-js')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1"
              title="Insert JavaScript code block"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              JS
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('code-py')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              title="Insert Python code block"
            >
              Python
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('code-html')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              title="Insert HTML code block"
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('code-css')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              title="Insert CSS code block"
            >
              CSS
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => insertTemplate('inline-code')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              title="Inline code"
            >
              `code`
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('heading')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded font-bold"
              title="Insert heading"
            >
              H
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('list')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              title="Insert list"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('blockquote')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              title="Insert blockquote"
            >
              " Quote
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{wordCount.toLocaleString()} words</span>
              <span>•</span>
              <span>{charCount.toLocaleString()} chars</span>
              <span>•</span>
              <span className="text-blue-600 font-medium">{readingTime}</span>
            </div>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              title="Toggle preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {showPreview ? 'Hide' : 'Show'}
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
              title={isFullscreen ? 'Exit fullscreen (ESC)' : 'Fullscreen mode'}
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className={`grid gap-4 ${isFullscreen ? 'flex-1 overflow-hidden' : ''} ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Textarea */}
          <div className={isFullscreen ? 'h-full flex flex-col' : ''}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm ${
                isFullscreen ? 'flex-1 h-full' : ''
              }`}
              placeholder="Write your content in markdown... 

Tips:
- Press Tab for indentation
- Use quick insert buttons above
- Toggle preview to see results
- Press fullscreen for focus mode"
              style={!isFullscreen ? { minHeight: '400px' } : {}}
            />
            {error && (
              <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
          </div>

          {/* Preview */}
          {showPreview && (
            <div className={`border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto ${
              isFullscreen ? 'h-full' : 'max-h-[600px]'
            }`}>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Preview</span>
              </div>
              {value ? (
                <div className="bg-white rounded p-4">
                  <MarkdownContent content={value} />
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">Start typing to see preview...</p>
              )}
            </div>
          )}
        </div>

        {/* Keyboard Shortcuts Help */}
        {isFullscreen && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            <strong>Shortcuts:</strong> Tab = Indent • ESC = Exit fullscreen • Quick insert buttons untuk code blocks
          </div>
        )}
      </div>
    </div>
  )
}
