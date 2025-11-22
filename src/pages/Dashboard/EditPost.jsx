import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetPostByIdQuery, useUpdatePostMutation } from '../../store/api/postsApi'
import { PostForm } from '../../components/Post/PostForm'

export const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const { data: post, isLoading } = useGetPostByIdQuery(id)

  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()

  // Transform post data for the form
  const formattedPost = useMemo(() => {
    if (!post) return null
    
    return {
      ...post,
      // Transform tags array for form: extract tag IDs
      tagIds: post.tags?.map(t => t.tag.id) || [],
    }
  }, [post])

  const handleSubmit = async (data) => {
    setError('')
    try {
      await updatePost({ postId: id, updates: data }).unwrap()
      alert('Post updated successfully!')
      navigate('/dashboard/posts')
    } catch (error) {
      setError(error)
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (!formattedPost) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Post not found</h2>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-gray-600 mt-2">Update your post content and settings.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="card">
        <PostForm
          post={formattedPost}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
        />
      </div>
    </div>
  )
}
