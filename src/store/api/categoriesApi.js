import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '../../lib/supabase'

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    // Get All Categories
    getAllCategories: builder.query({
      async queryFn() {
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name')

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: ['Categories'],
    }),

    // Get Categories with Post Count
    getCategoriesWithCount: builder.query({
      async queryFn() {
        try {
          const { data, error } = await supabase
            .from('categories')
            .select(`
              *,
              posts(count)
            `)
            .order('name')

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: ['Categories'],
    }),

    // Create Category
    createCategory: builder.mutation({
      async queryFn(categoryData) {
        try {
          const { data, error } = await supabase
            .from('categories')
            .insert(categoryData)
            .select()
            .single()

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['Categories'],
    }),

    // Update Category
    updateCategory: builder.mutation({
      async queryFn({ categoryId, updates }) {
        try {
          const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', categoryId)
            .select()
            .single()

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['Categories'],
    }),

    // Delete Category
    deleteCategory: builder.mutation({
      async queryFn(categoryId) {
        try {
          const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', categoryId)

          if (error) throw error
          return { data: null }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['Categories'],
    }),
  }),
})

export const {
  useGetAllCategoriesQuery,
  useGetCategoriesWithCountQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi
