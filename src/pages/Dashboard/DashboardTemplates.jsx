import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const DashboardTemplates = () => {
  const [templates, setTemplates] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateContent, setTemplateContent] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    const savedTemplates = localStorage.getItem('postTemplates')
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    }
  }

  const saveTemplates = (newTemplates) => {
    localStorage.setItem('postTemplates', JSON.stringify(newTemplates))
    setTemplates(newTemplates)
  }

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name')
      return
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      data: {
        title: '',
        content: templateContent,
        excerpt: templateDescription,
        featured_image: '',
        status: 'draft',
        category_id: '',
        tagIds: [],
      },
      createdAt: new Date().toISOString(),
    }

    const updatedTemplates = [...templates, newTemplate]
    saveTemplates(updatedTemplates)
    setShowCreateModal(false)
    resetForm()
    alert('Template created successfully!')
  }

  const resetForm = () => {
    setTemplateName('')
    setTemplateDescription('')
    setTemplateContent('')
  }

  const handleDelete = (templateId) => {
    if (window.confirm('Delete this template?')) {
      const updatedTemplates = templates.filter(t => t.id !== templateId)
      saveTemplates(updatedTemplates)
    }
  }

  const handleUseTemplate = (template) => {
    localStorage.setItem('selectedTemplate', JSON.stringify(template))
    navigate('/dashboard/posts/new?template=' + template.id)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(templates, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'post-templates.json'
    link.click()
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const importedTemplates = JSON.parse(event.target.result)
          const updatedTemplates = [...templates, ...importedTemplates]
          saveTemplates(updatedTemplates)
          alert('Templates imported successfully!')
        } catch (error) {
          alert('Failed to import templates: Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🎨 Post Templates</h1>
        <div className="flex gap-3">
          <label className="btn-secondary cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            Import
          </label>
          {templates.length > 0 && (
            <button onClick={handleExport} className="btn-secondary">
              Export
            </button>
          )}
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            Create Template
          </button>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No templates yet</h3>
          <p className="text-gray-500 mb-4">Create reusable templates to speed up your content creation</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            Create First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="card border-2 border-purple-200 hover:border-purple-400 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                {template.data.content && (
                  <>
                    <span>•</span>
                    <span>{template.data.content.split(/\s+/).length} words</span>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Use Template
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="card mt-6 bg-purple-50 border-purple-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-purple-900">
            <p className="font-semibold mb-1">About Templates:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Create templates with pre-filled content, categories, and tags</li>
              <li>Use templates when creating new posts to save time</li>
              <li>Export templates to share with team members</li>
              <li>Import templates from JSON files</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create New Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Tutorial Post Template"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="textarea-field"
                  placeholder="Describe what this template is for..."
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Content (Markdown)
                </label>
                <textarea
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  className="textarea-field font-mono"
                  placeholder="# Template Content

Write your default template content here...

## Section 1

Content goes here..."
                  rows="12"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreateTemplate} className="btn-primary flex-1">
                Create Template
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
