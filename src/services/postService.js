import { supabase } from '../lib/supabase'

export const postService = {
  async getAllPublishedPosts() {
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
        category:categories(id, name, slug, color)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getPostBySlug(slug) {
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

    if (data) {
      await supabase.rpc('increment_post_views', { post_uuid: data.id })
    }

    return data
  },

  async getPostsByCategory(categorySlug) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        author:profiles(username, avatar_url),
        category:categories!inner(name, slug)
      `)
      .eq('status', 'published')
      .eq('category.slug', categorySlug)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data
  },

  async searchPosts(query) {
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
    return data
  },

  async getAuthorPosts(authorId) {
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
    return data
  },

  async createPost(postData) {
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

    return post
  },

  async updatePost(postId, updates) {
    const { data, error } = await supabase
      .from('posts')
      .update({
        title: updates.title,
        slug: updates.slug,
        content: updates.content,
        excerpt: updates.excerpt,
        featured_image: updates.featured_image,
        status: updates.status,
        category_id: updates.category_id,
      })
      .eq('id', postId)
      .select()
      .single()

    if (error) throw error

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

    return data
  },

  async deletePost(postId) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) throw error
  },
}
