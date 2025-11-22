import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreatePostMutation } from '../../store/api/postsApi'
import { PostForm } from '../../components/Post/PostForm'

export const CreatePost = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const [createPost, { isLoading }] = useCreatePostMutation()

  const handleSubmit = async (data) => {
    setError('')
    try {
      await createPost(data).unwrap()
      alert('Post created successfully!')
      navigate('/dashboard/posts')
    } catch (error) {
      setError(error)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-gray-600 mt-2">Write your documentation or blog post in markdown format.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="card">
        <PostForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </div>
    </div>
  )
}
