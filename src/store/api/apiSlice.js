import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '../../lib/supabase'

// Custom base query using Supabase client
const supabaseBaseQuery = async (args, api, extraOptions) => {
  // This is a wrapper to work with Supabase
  // RTK Query will handle caching and refetching
  return { data: null }
}

// Base API slice with RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: supabaseBaseQuery,
  tagTypes: ['Posts', 'Post', 'Categories', 'Tags', 'User'],
  endpoints: (builder) => ({}),
})

export const { middleware: apiMiddleware } = apiSlice
