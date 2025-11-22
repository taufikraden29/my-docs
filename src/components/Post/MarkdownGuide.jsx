import { useState } from 'react'

export const MarkdownGuide = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-100 transition"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-blue-900">
            📝 Panduan Menulis Markdown
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4 text-sm">
          {/* Headings */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">📌 Headings</h4>
            <div className="bg-white rounded p-3 border border-gray-200 font-mono text-xs space-y-1">
              <div className="text-gray-600"># Heading 1</div>
              <div className="text-gray-600">## Heading 2</div>
              <div className="text-gray-600">### Heading 3</div>
            </div>
          </div>

          {/* Text Formatting */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">✏️ Format Teks</h4>
            <div className="bg-white rounded p-3 border border-gray-200 font-mono text-xs space-y-1">
              <div className="text-gray-600">**Bold text**</div>
              <div className="text-gray-600">*Italic text*</div>
              <div className="text-gray-600">~~Strikethrough~~</div>
            </div>
          </div>

          {/* Inline Code */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">💻 Inline Code (di dalam teks)</h4>
            <div className="bg-white rounded p-3 border border-gray-200 space-y-2">
              <div className="font-mono text-xs text-gray-600">
                Gunakan `backtick` untuk inline code
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Contoh: Fungsi `console.log()` digunakan untuk debugging
              </div>
            </div>
          </div>

          {/* Code Blocks */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🎨 Code Blocks (dengan Syntax Highlighting)</h4>
            <div className="bg-white rounded p-3 border border-gray-200 space-y-2">
              <p className="text-xs text-gray-600 mb-2">
                Gunakan 3 backticks (```) dengan nama bahasa:
              </p>
              <div className="bg-gray-800 text-gray-100 rounded p-3 font-mono text-xs overflow-x-auto">
                <div className="text-green-400">```javascript</div>
                <div className="text-yellow-300">function</div>
                <div className="pl-2">{'  '}console.log("Hello World!")</div>
                <div>{'}'}</div>
                <div className="text-green-400">```</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Bahasa yang didukung: javascript, python, html, css, java, php, sql, dll.
              </p>
            </div>
          </div>

          {/* Lists */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">📋 Lists</h4>
            <div className="bg-white rounded p-3 border border-gray-200 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Unordered:</p>
                <div className="font-mono text-xs text-gray-600 space-y-1">
                  <div>- Item 1</div>
                  <div>- Item 2</div>
                  <div>- Item 3</div>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Ordered:</p>
                <div className="font-mono text-xs text-gray-600 space-y-1">
                  <div>1. First item</div>
                  <div>2. Second item</div>
                  <div>3. Third item</div>
                </div>
              </div>
            </div>
          </div>

          {/* Links & Images */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🔗 Links & Images</h4>
            <div className="bg-white rounded p-3 border border-gray-200 font-mono text-xs space-y-1">
              <div className="text-gray-600">[Link Text](https://example.com)</div>
              <div className="text-gray-600">![Alt Text](image-url.jpg)</div>
            </div>
          </div>

          {/* Blockquotes */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">💬 Blockquotes</h4>
            <div className="bg-white rounded p-3 border border-gray-200 font-mono text-xs">
              <div className="text-gray-600">&gt; This is a quote</div>
            </div>
          </div>

          {/* Tables */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">📊 Tables</h4>
            <div className="bg-white rounded p-3 border border-gray-200 font-mono text-xs space-y-1">
              <div className="text-gray-600">| Header 1 | Header 2 |</div>
              <div className="text-gray-600">| -------- | -------- |</div>
              <div className="text-gray-600">| Cell 1   | Cell 2   |</div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips Penting
            </h4>
            <ul className="text-xs text-green-800 space-y-1 list-disc list-inside">
              <li>Code blocks akan ditampilkan dengan dark theme & syntax highlighting</li>
              <li>Inline code menggunakan 1 backtick `seperti ini`</li>
              <li>Teks deskripsi biasa akan ditampilkan dengan typography yang jelas</li>
              <li>Gunakan heading untuk struktur konten yang rapi</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
