import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const code = String(children).replace(/\n$/, '')
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden shadow-lg border border-gray-200 relative group">
      {language && (
        <div className="bg-gray-800 text-gray-300 text-xs font-mono px-4 py-2 flex items-center justify-between">
          <span className="uppercase tracking-wide">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all"
            title="Copy code"
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.9rem',
          padding: '1.25rem',
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  )
}

export const MarkdownContent = ({ content }) => {
  if (!content) {
    return <div className="text-gray-400 italic">No content available</div>
  }

  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''

            if (!inline) {
              return <CodeBlock language={language}>{children}</CodeBlock>
            }

            return (
              <code
                className="bg-gray-100 text-red-600 px-2 py-0.5 rounded text-sm font-mono border border-gray-200"
                {...props}
              >
                {children}
              </code>
            )
          },
          h1: ({ children, ...props }) => {
            const text = String(children)
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
            return (
              <h1 id={id} className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b-2 border-blue-500 pb-2 scroll-mt-24" {...props}>
                {children}
              </h1>
            )
          },
          h2: ({ children, ...props }) => {
            const text = String(children)
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
            return (
              <h2 id={id} className="text-2xl font-bold mt-6 mb-3 text-gray-900 border-b border-gray-300 pb-2 scroll-mt-24" {...props}>
                {children}
              </h2>
            )
          },
          h3: ({ children, ...props }) => {
            const text = String(children)
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
            return (
              <h3 id={id} className="text-xl font-semibold mt-5 mb-2 text-gray-800 scroll-mt-24" {...props}>
                {children}
              </h3>
            )
          },
          p: (props) => (
            <p className="text-gray-700 leading-relaxed mb-4 text-base" {...props} />
          ),
          blockquote: (props) => (
            <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-gray-700" {...props} />
          ),
          ul: (props) => (
            <ul className="list-disc list-inside space-y-2 my-4 text-gray-700" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal list-inside space-y-2 my-4 text-gray-700" {...props} />
          ),
          a: (props) => (
            <a
              className="text-blue-600 hover:text-blue-800 underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          table: (props) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          thead: (props) => (
            <thead className="bg-gray-100" {...props} />
          ),
          th: (props) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900" {...props} />
          ),
          td: (props) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props} />
          ),
          hr: (props) => (
            <hr className="my-8 border-t-2 border-gray-300" {...props} />
          ),
          img: (props) => (
            <img
              className="rounded-lg shadow-md my-6 max-w-full h-auto"
              loading="lazy"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
