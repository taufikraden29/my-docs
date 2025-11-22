import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '../../lib/supabase'

export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Tags'],
  endpoints: (builder) => ({
    // Get All Tags
    getAllTags: builder.query({
      async queryFn() {
        try {
          const { data, error } = await supabase
            .from('tags')
            .select('*')
            .order('name')

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: ['Tags'],
    }),

    // Get Tags with Post Count
    getTagsWithCount: builder.query({
      async queryFn() {
        try {
          const { data, error } = await supabase
            .from('tags')
            .select(`
              *,
              post_tags(count)
            `)
            .order('name')

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: ['Tags'],
    }),

    // Create Tag
    createTag: builder.mutation({
      async queryFn(tagData) {
        try {
          const { data, error } = await supabase
            .from('tags')
            .insert(tagData)
            .select()
            .single()

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['Tags'],
    }),

    // Update Tag
    updateTag: builder.mutation({
      async queryFn({ tagId, updates }) {
        try {
          const { data, error } = await supabase
            .from('tags')
            .update(updates)
            .eq('id', tagId)
            .select()
            .single()

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['Tags'],
    }),

    // Delete Tag
    deleteTag: builder.mutation({
      async queryFn(tagId) {
        try {
          const { error } = await supabase
            .from('tags')
            .delete()
            .eq('id', tagId)

          if (error) throw error
          return { data: null }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['Tags'],
    }),
  }),
})

export const {
  useGetAllTagsQuery,
  useGetTagsWithCountQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagsApi
