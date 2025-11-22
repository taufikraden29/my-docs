import { useState, useEffect } from 'react'

export const TemplateManager = ({ onApplyTemplate }) => {
  const [templates, setTemplates] = useState([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [currentFormData, setCurrentFormData] = useState(null)

  useEffect(() => {
    const savedTemplates = localStorage.getItem('postTemplates')
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    }
  }, [])

  const saveTemplates = (newTemplates) => {
    localStorage.setItem('postTemplates', JSON.stringify(newTemplates))
    setTemplates(newTemplates)
  }

  const handleSaveAsTemplate = (formData) => {
    setCurrentFormData(formData)
    setShowSaveModal(true)
  }

  const confirmSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name')
      return
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      data: currentFormData,
      createdAt: new Date().toISOString(),
    }

    const updatedTemplates = [...templates, newTemplate]
    saveTemplates(updatedTemplates)
    setShowSaveModal(false)
    setTemplateName('')
    setTemplateDescription('')
    alert('Template saved successfully!')
  }

  const handleApply = (template) => {
    if (window.confirm(`Apply template "${template.name}"? Current form data will be replaced.`)) {
      onApplyTemplate(template.data)
    }
  }

  const handleDelete = (templateId) => {
    if (window.confirm('Delete this template?')) {
      const updatedTemplates = templates.filter(t => t.id !== templateId)
      saveTemplates(updatedTemplates)
    }
  }

  return (
    <div className="card border-2 border-purple-100 bg-purple-50/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <h3 className="font-semibold text-gray-900">🎨 Post Templates</h3>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No templates saved yet</p>
          <p className="text-xs mt-1">Save your current form as a template to reuse it later</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{template.name}</h4>
                  {template.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{template.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                    {template.data.category_id && (
                      <span className="px-2 py-0.5 bg-gray-200 rounded">Has category</span>
                    )}
                    {template.data.tagIds?.length > 0 && (
                      <span className="px-2 py-0.5 bg-gray-200 rounded">
                        {template.data.tagIds.length} tags
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApply(template)}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Save as Template</h3>
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
                  Description (Optional)
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="textarea-field"
                  placeholder="Describe what this template is for..."
                  rows="3"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={confirmSaveTemplate} className="btn-primary flex-1">
                Save Template
              </button>
              <button
                onClick={() => {
                  setShowSaveModal(false)
                  setTemplateName('')
                  setTemplateDescription('')
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

export const useSaveTemplate = () => {
  const [showTemplateManager, setShowTemplateManager] = useState(false)

  const saveAsTemplate = (formData) => {
    return new Promise((resolve) => {
      const templateName = prompt('Enter template name:')
      if (templateName) {
        const templates = JSON.parse(localStorage.getItem('postTemplates') || '[]')
        const newTemplate = {
          id: Date.now().toString(),
          name: templateName,
          data: formData,
          createdAt: new Date().toISOString(),
        }
        templates.push(newTemplate)
        localStorage.setItem('postTemplates', JSON.stringify(templates))
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }

  return { saveAsTemplate, showTemplateManager, setShowTemplateManager }
}
