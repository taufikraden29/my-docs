import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useGetAllCategoriesQuery } from '../../store/api/categoriesApi'
import { useGetAllTagsQuery } from '../../store/api/tagsApi'
import { slugify } from '../../utils/slugify'
import { MarkdownGuide } from './MarkdownGuide'
import { EnhancedMarkdownEditor } from './EnhancedMarkdownEditor'

export const PostForm = ({ post, onSubmit, isSubmitting }) => {
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
  const titleValue = watch('title')
  const contentValue = watch('content')

  const { data: categories = [] } = useGetAllCategoriesQuery()
  const { data: tags = [] } = useGetAllTagsQuery()

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
    }
  }, [post, reset])

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
    onSubmit({ ...data, tagIds: selectedTags })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
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
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  )
}
