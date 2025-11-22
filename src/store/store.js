import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// API slices
import { authApi } from './api/authApi'
import { postsApi } from './api/postsApi'
import { categoriesApi } from './api/categoriesApi'
import { tagsApi } from './api/tagsApi'
import { profileApi } from './api/profileApi'

// Regular slices
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    // API reducers
    [authApi.reducerPath]: authApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    
    // Regular reducers
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      postsApi.middleware,
      categoriesApi.middleware,
      tagsApi.middleware,
      profileApi.middleware
    ),
})

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)

export default store
