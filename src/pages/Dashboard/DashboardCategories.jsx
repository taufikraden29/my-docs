import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../store/api/categoriesApi'
import { slugify } from '../../utils/slugify'

export const DashboardCategories = () => {
  const [editingId, setEditingId] = useState(null)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const { data: categories = [], isLoading } = useGetAllCategoriesQuery()

  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const onSubmit = async (data) => {
    const categoryData = {
      ...data,
      slug: slugify(data.name),
    }

    try {
      if (editingId) {
        await updateCategory({ categoryId: editingId, updates: categoryData }).unwrap()
        alert('Category updated successfully!')
      } else {
        await createCategory(categoryData).unwrap()
        alert('Category created successfully!')
      }
      setEditingId(null)
      reset()
    } catch (error) {
      alert('Failed to save category: ' + error)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setValue('name', category.name)
    setValue('description', category.description || '')
    setValue('color', category.color)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    reset()
  }

  const handleDelete = async (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      try {
        await deleteCategory(categoryId).unwrap()
        alert('Category deleted successfully!')
      } catch (error) {
        alert('Failed to delete category: ' + error)
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
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="Category name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="textarea-field"
                  placeholder="Category description"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color (Hex) *
                </label>
                <input
                  {...register('color', { required: 'Color is required' })}
                  type="color"
                  className="input-field h-12"
                  defaultValue="#3B82F6"
                />
                {errors.color && (
                  <p className="text-red-600 text-sm mt-1">{errors.color.message}</p>
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
            <h2 className="text-xl font-bold mb-4">All Categories</h2>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No categories yet. Create one!</p>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.slug}</p>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
