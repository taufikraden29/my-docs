import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  useGetAllTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from '../../store/api/tagsApi'
import { slugify } from '../../utils/slugify'

export const DashboardTags = () => {
  const [editingId, setEditingId] = useState(null)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const { data: tags = [], isLoading } = useGetAllTagsQuery()

  const [createTag] = useCreateTagMutation()
  const [updateTag] = useUpdateTagMutation()
  const [deleteTag] = useDeleteTagMutation()

  const onSubmit = async (data) => {
    const tagData = {
      ...data,
      slug: slugify(data.name),
    }

    try {
      if (editingId) {
        await updateTag({ tagId: editingId, updates: tagData }).unwrap()
        alert('Tag updated successfully!')
      } else {
        await createTag(tagData).unwrap()
        alert('Tag created successfully!')
      }
      setEditingId(null)
      reset()
    } catch (error) {
      alert('Failed to save tag: ' + error)
    }
  }

  const handleEdit = (tag) => {
    setEditingId(tag.id)
    setValue('name', tag.name)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    reset()
  }

  const handleDelete = async (tagId, tagName) => {
    if (window.confirm(`Are you sure you want to delete "${tagName}"?`)) {
      try {
        await deleteTag(tagId).unwrap()
        alert('Tag deleted successfully!')
      } catch (error) {
        alert('Failed to delete tag: ' + error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Tags</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Tag' : 'Add New Tag'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Name *
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="e.g., JavaScript, React, Tutorial"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">All Tags</h2>
            {tags.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tags yet. Create one!</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                  >
                    <span className="font-medium">#{tag.name}</span>
                    <span className="text-xs text-gray-500">({tag.slug})</span>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id, tag.name)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
