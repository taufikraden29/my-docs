import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '../../lib/supabase'

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Profile', 'SocialLinks'],
  endpoints: (builder) => ({
    // Get Profile by Username
    getProfileByUsername: builder.query({
      async queryFn(username) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single()

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: (result, error, username) => [
        { type: 'Profile', id: username },
      ],
    }),

    // Get Profile by ID
    getProfileById: builder.query({
      async queryFn(userId) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: (result, error, userId) => [
        { type: 'Profile', id: userId },
      ],
    }),

    // Update Profile (including social links)
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
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Profile', id: userId },
        'SocialLinks',
      ],
    }),

    // Update Social Links specifically
    updateSocialLinks: builder.mutation({
      async queryFn({ userId, socialLinks }) {
        try {
          const updates = {
            github_url: socialLinks.github || null,
            twitter_url: socialLinks.twitter || null,
            linkedin_url: socialLinks.linkedin || null,
            website_url: socialLinks.website || null,
            email_public: socialLinks.email || null,
          }

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
      invalidatesTags: ['Profile', 'SocialLinks'],
    }),

    // Get Social Links for a user
    getSocialLinks: builder.query({
      async queryFn(userId) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('github_url, twitter_url, linkedin_url, website_url, email_public')
            .eq('id', userId)
            .single()

          if (error) throw error

          return {
            data: {
              github: data.github_url || '',
              twitter: data.twitter_url || '',
              linkedin: data.linkedin_url || '',
              website: data.website_url || '',
              email: data.email_public || '',
            },
          }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: ['SocialLinks'],
    }),
  }),
})

export const {
  useGetProfileByUsernameQuery,
  useGetProfileByIdQuery,
  useUpdateProfileMutation,
  useUpdateSocialLinksMutation,
  useGetSocialLinksQuery,
} = profileApi
