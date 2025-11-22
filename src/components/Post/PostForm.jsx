import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useGetAllCategoriesQuery } from '../../store/api/categoriesApi'
import { useGetAllTagsQuery } from '../../store/api/tagsApi'
import { slugify } from '../../utils/slugify'
import { MarkdownGuide } from './MarkdownGuide'
import { EnhancedMarkdownEditor } from './EnhancedMarkdownEditor'
import { useAutoSave, formatLastSaved } from '../../hooks/useAutoSave'
import { PostScheduler } from './PostScheduler'
import { SEOHelper } from './SEOHelper'
import { TemplateManager } from './TemplateManager'

export const PostForm = ({ post, onSubmit, isSubmitting, enableAutoSave = false }) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      status: 'draft',
      category_id: '',
      tagIds: [],
    },
  })

  const [selectedTags, setSelectedTags] = useState(post?.tagIds || [])
  const [featuredImagePreview, setFeaturedImagePreview] = useState(post?.featured_image || '')
  const [scheduledDate, setScheduledDate] = useState(post?.scheduled_at || null)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  
  const titleValue = watch('title')
  const contentValue = watch('content')
  const featuredImageValue = watch('featured_image')
  const excerptValue = watch('excerpt')
  const categoryValue = watch('category_id')
  const statusValue = watch('status')
  const slugValue = watch('slug')

  const { data: categories = [] } = useGetAllCategoriesQuery()
  const { data: tags = [] } = useGetAllTagsQuery()

  // Auto-save for drafts
  const autoSaveData = {
    title: titleValue,
    content: contentValue,
    excerpt: excerptValue,
    featured_image: featuredImageValue,
    category_id: categoryValue,
    status: statusValue || 'draft',
    tagIds: selectedTags,
  }

  const { lastSaved, isSaving } = useAutoSave(
    autoSaveData,
    async (data) => {
      if (enableAutoSave && post?.id && data.status === 'draft') {
        await onSubmit(data, true)
      }
    },
    5000
  )

  // Register content field manually for validation
  useEffect(() => {
    register('content', { required: 'Content is required' })
  }, [register])

  // Reset form when editing (post data is loaded)
  useEffect(() => {
    if (post) {
      reset({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        featured_image: post.featured_image || '',
        status: post.status || 'draft',
        category_id: post.category_id || '',
        tagIds: post.tagIds || [],
      })
      setSelectedTags(post.tagIds || [])
      setFeaturedImagePreview(post.featured_image || '')
    }
  }, [post, reset])

  // Update featured image preview
  useEffect(() => {
    if (featuredImageValue) {
      setFeaturedImagePreview(featuredImageValue)
    }
  }, [featuredImageValue])

  // Auto-generate slug from title when creating new post
  useEffect(() => {
    if (titleValue && !post) {
      setValue('slug', slugify(titleValue))
    }
  }, [titleValue, setValue, post])

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const onFormSubmit = (data) => {
    const submitData = { 
      ...data, 
      tagIds: selectedTags,
      scheduled_at: scheduledDate
    }
    
    if (scheduledDate && new Date(scheduledDate) > new Date()) {
      submitData.status = 'scheduled'
    }
    
    onSubmit(submitData)
  }

  const handleApplyTemplate = (templateData) => {
    if (templateData.title) setValue('title', templateData.title)
    if (templateData.content) setValue('content', templateData.content)
    if (templateData.excerpt) setValue('excerpt', templateData.excerpt)
    if (templateData.featured_image) setValue('featured_image', templateData.featured_image)
    if (templateData.category_id) setValue('category_id', templateData.category_id)
    if (templateData.tagIds) setSelectedTags(templateData.tagIds)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Auto-save indicator */}
      {enableAutoSave && (
        <div className="flex items-center gap-2 text-sm">
          {isSaving ? (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving draft...</span>
            </div>
          ) : lastSaved ? (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Draft saved {formatLastSaved(lastSaved)}</span>
            </div>
          ) : (
            <div className="text-gray-500">Auto-save enabled</div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="input-field"
          placeholder="Enter post title"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug *
        </label>
        <input
          {...register('slug', { required: 'Slug is required' })}
          className="input-field"
          placeholder="post-slug"
        />
        {errors.slug && (
          <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          {...register('excerpt')}
          className="textarea-field"
          placeholder="Short description of the post..."
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content * (Markdown)
        </label>
        
        <div className="mb-3">
          <MarkdownGuide />
        </div>

        <EnhancedMarkdownEditor
          value={contentValue || ''}
          onChange={(value) => setValue('content', value)}
          error={errors.content?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image URL
        </label>
        <input
          {...register('featured_image')}
          className="input-field"
          placeholder="https://example.com/image.jpg"
        />
        {featuredImagePreview && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div className="relative rounded-lg overflow-hidden border border-gray-300">
              <img
                src={featuredImagePreview}
                alt="Featured image preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="hidden absolute inset-0 items-center justify-center bg-gray-100 text-gray-500 text-sm">
                Failed to load image
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          {...register('category_id', { required: 'Category is required' })}
          className="input-field"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-red-600 text-sm mt-1">{errors.category_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                selectedTags.includes(tag.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          {...register('status')}
          className="input-field"
          disabled={scheduledDate && new Date(scheduledDate) > new Date()}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </select>
        {scheduledDate && new Date(scheduledDate) > new Date() && (
          <p className="text-sm text-blue-600 mt-1">Status will be set to "scheduled"</p>
        )}
      </div>

      {/* Advanced Options Toggle */}
      <div className="border-t pt-6">
        <button
          type="button"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg
            className={`w-5 h-5 transition-transform ${showAdvancedOptions ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Advanced Options (Scheduling, Templates, SEO)
        </button>
      </div>

      {/* Advanced Options Section */}
      {showAdvancedOptions && (
        <div className="space-y-6">
          <TemplateManager onApplyTemplate={handleApplyTemplate} />
          
          <PostScheduler
            scheduledDate={scheduledDate}
            onScheduleChange={setScheduledDate}
            status={statusValue}
          />
          
          <SEOHelper
            title={titleValue}
            content={contentValue}
            excerpt={excerptValue}
            slug={slugValue}
          />
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
        {!post && (
          <button
            type="button"
            onClick={() => {
              const formData = {
                title: titleValue,
                content: contentValue,
                excerpt: excerptValue,
                featured_image: featuredImageValue,
                category_id: categoryValue,
                tagIds: selectedTags,
              }
              const name = prompt('Save as template with name:')
              if (name) {
                const templates = JSON.parse(localStorage.getItem('postTemplates') || '[]')
                templates.push({
                  id: Date.now().toString(),
                  name,
                  data: formData,
                  createdAt: new Date().toISOString(),
                })
                localStorage.setItem('postTemplates', JSON.stringify(templates))
                alert('Template saved!')
              }
            }}
            className="btn-secondary"
          >
            Save as Template
          </button>
        )}
      </div>
    </form>
  )
}
