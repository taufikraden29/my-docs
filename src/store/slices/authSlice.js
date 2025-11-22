import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '../api/authApi'

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.isLoading = false
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle sign in
      .addMatcher(
        authApi.endpoints.signIn.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user
          state.isAuthenticated = true
          state.isLoading = false
        }
      )
      // Handle sign out
      .addMatcher(
        authApi.endpoints.signOut.matchFulfilled,
        (state) => {
          state.user = null
          state.isAuthenticated = false
          state.isLoading = false
        }
      )
      // Handle get current user
      .addMatcher(
        authApi.endpoints.getCurrentUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload
          state.isAuthenticated = !!payload
          state.isLoading = false
        }
      )
  },
})

export const { setUser, clearUser, setLoading } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.isLoading
