import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
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
import { DashboardAnalytics } from './pages/Dashboard/DashboardAnalytics'
import { DashboardScheduled } from './pages/Dashboard/DashboardScheduled'
import { DashboardTemplates } from './pages/Dashboard/DashboardTemplates'
import { DashboardProfile } from './pages/Dashboard/DashboardProfile'

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
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
          },
          // Success
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              border: '1px solid #d1fae5',
            },
          },
          // Error
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              border: '1px solid #fee2e2',
            },
          },
          // Loading
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />

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
          <Route path="analytics" element={<DashboardAnalytics />} />
          <Route path="scheduled" element={<DashboardScheduled />} />
          <Route path="templates" element={<DashboardTemplates />} />
          <Route path="profile" element={<DashboardProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
