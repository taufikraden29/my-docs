import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useGetCurrentUserQuery } from './store/api/authApi'
import { setUser, setLoading } from './store/slices/authSlice'

import { HomePage } from './pages/Home/HomePage'
import { PostDetailPage } from './pages/Post/PostDetailPage'
import { SearchPage } from './pages/Search/SearchPage'
import { LoginPage } from './pages/Auth/LoginPage'
import { RegisterPage } from './pages/Auth/RegisterPage'
import { DashboardLayout } from './pages/Dashboard/DashboardLayout'
import { DashboardHome } from './pages/Dashboard/DashboardHome'
import { DashboardPosts } from './pages/Dashboard/DashboardPosts'
import { CreatePost } from './pages/Dashboard/CreatePost'
import { EditPost } from './pages/Dashboard/EditPost'
import { DashboardCategories } from './pages/Dashboard/DashboardCategories'
import { DashboardTags } from './pages/Dashboard/DashboardTags'

function App() {
  const dispatch = useDispatch()
  const { data: user, isLoading } = useGetCurrentUserQuery()

  useEffect(() => {
    if (!isLoading) {
      dispatch(setUser(user))
    }
  }, [user, isLoading, dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:slug" element={<PostDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="posts" element={<DashboardPosts />} />
          <Route path="posts/new" element={<CreatePost />} />
          <Route path="posts/:id/edit" element={<EditPost />} />
          <Route path="categories" element={<DashboardCategories />} />
          <Route path="tags" element={<DashboardTags />} />
          <Route path="profile" element={<div className="card"><p>Profile settings coming soon...</p></div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
