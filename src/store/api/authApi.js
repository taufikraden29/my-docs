import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '../../lib/supabase'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['User', 'Profile'],
  endpoints: (builder) => ({
    // Sign Up
    signUp: builder.mutation({
      async queryFn({ email, password, username, fullName }) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                username,
                full_name: fullName,
              },
            },
          })
          
          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
    }),

    // Sign In
    signIn: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          
          if (error) throw error

          // Fetch profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (profileError) throw profileError

          return { data: { ...data, profile } }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['User'],
    }),

    // Sign Out
    signOut: builder.mutation({
      async queryFn() {
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          return { data: null }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['User'],
    }),

    // Get Current User
    getCurrentUser: builder.query({
      async queryFn() {
        try {
          const { data: { user }, error } = await supabase.auth.getUser()
          
          if (error) throw error
          if (!user) return { data: null }

          // Fetch profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profileError) throw profileError

          return { data: { ...user, profile } }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: ['User'],
    }),

    // Update Profile
    updateProfile: builder.mutation({
      async queryFn({ userId, updates }) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['User', 'Profile'],
    }),
  }),
})

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} = authApi
