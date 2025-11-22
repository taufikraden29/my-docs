import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '../../lib/supabase'

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Posts', 'Post'],
  endpoints: (builder) => ({
    // Get All Published Posts
    getAllPublishedPosts: builder.query({
      async queryFn() {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select(`
              id,
              title,
              slug,
              excerpt,
              featured_image,
              view_count,
              published_at,
              created_at,
              author:profiles(id, username, full_name, avatar_url),
              category:categories(id, name, slug, color),
              tags:post_tags(tag:tags(id, name, slug))
            `)
            .eq('status', 'published')
            .order('published_at', { ascending: false })

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: ['Posts'],
    }),

    // Get Post by Slug
    getPostBySlug: builder.query({
      async queryFn(slug) {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select(`
              *,
              author:profiles(id, username, full_name, avatar_url),
              category:categories(id, name, slug, color),
              tags:post_tags(tag:tags(id, name, slug))
            `)
            .eq('slug', slug)
            .single()

          if (error) throw error

          // Increment view count
          if (data) {
            await supabase.rpc('increment_post_views', { post_uuid: data.id })
          }

          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: (result, error, slug) => [{ type: 'Post', id: slug }],
    }),

    // Get Post by ID (for editing)
    getPostById: builder.query({
      async queryFn(id) {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select(`
              *,
              category:categories(id, name),
              tags:post_tags(tag:tags(id, name))
            `)
            .eq('id', id)
            .single()

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    // Get Author Posts
    getAuthorPosts: builder.query({
      async queryFn(authorId) {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select(`
              *,
              category:categories(id, name, slug),
              tags:post_tags(tag:tags(id, name, slug))
            `)
            .eq('author_id', authorId)
            .order('created_at', { ascending: false })

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      providesTags: ['Posts'],
    }),

    // Search Posts
    searchPosts: builder.query({
      async queryFn(query) {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select(`
              id,
              title,
              slug,
              excerpt,
              published_at,
              author:profiles(username)
            `)
            .eq('status', 'published')
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
            .order('published_at', { ascending: false })

          if (error) throw error
          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
    }),

    // Create Post
    createPost: builder.mutation({
      async queryFn(postData) {
        try {
          const { data: user } = await supabase.auth.getUser()

          const { data: post, error } = await supabase
            .from('posts')
            .insert({
              title: postData.title,
              slug: postData.slug,
              content: postData.content,
              excerpt: postData.excerpt,
              featured_image: postData.featured_image,
              status: postData.status,
              category_id: postData.category_id,
              author_id: user.user.id,
              published_at: postData.status === 'published' ? new Date().toISOString() : null,
            })
            .select()
            .single()

          if (error) throw error

          // Add tags
          if (postData.tagIds && postData.tagIds.length > 0) {
            const postTags = postData.tagIds.map(tagId => ({
              post_id: post.id,
              tag_id: tagId,
            }))

            const { error: tagError } = await supabase
              .from('post_tags')
              .insert(postTags)

            if (tagError) throw tagError
          }

          return { data: post }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['Posts'],
    }),

    // Update Post
    updatePost: builder.mutation({
      async queryFn({ postId, updates }) {
        try {
          // Get current post to check if status is changing to published
          const { data: currentPost } = await supabase
            .from('posts')
            .select('status, published_at')
            .eq('id', postId)
            .single()

          const updateData = {
            title: updates.title,
            slug: updates.slug,
            content: updates.content,
            excerpt: updates.excerpt,
            featured_image: updates.featured_image,
            status: updates.status,
            category_id: updates.category_id,
          }

          // Set published_at if status changes to published and it wasn't published before
          if (updates.status === 'published' && currentPost?.status !== 'published' && !currentPost?.published_at) {
            updateData.published_at = new Date().toISOString()
          }

          const { data, error } = await supabase
            .from('posts')
            .update(updateData)
            .eq('id', postId)
            .select()
            .single()

          if (error) throw error

          // Update tags
          if (updates.tagIds !== undefined) {
            await supabase
              .from('post_tags')
              .delete()
              .eq('post_id', postId)

            if (updates.tagIds.length > 0) {
              const postTags = updates.tagIds.map(tagId => ({
                post_id: postId,
                tag_id: tagId,
              }))

              await supabase.from('post_tags').insert(postTags)
            }
          }

          return { data }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        'Posts',
        { type: 'Post', id: postId },
      ],
    }),

    // Delete Post
    deletePost: builder.mutation({
      async queryFn(postId) {
        try {
          const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)

          if (error) throw error
          return { data: null }
        } catch (error) {
          return { error: error.message }
        }
      },
      invalidatesTags: ['Posts'],
    }),
  }),
})

export const {
  useGetAllPublishedPostsQuery,
  useGetPostBySlugQuery,
  useGetPostByIdQuery,
  useGetAuthorPostsQuery,
  useSearchPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi
