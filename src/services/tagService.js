import { supabase } from '../lib/supabase'

export const tagService = {
  async getAllTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  async getTagsWithCount() {
    const { data, error } = await supabase
      .from('tags')
      .select(`
        *,
        post_tags(count)
      `)
      .order('name')

    if (error) throw error
    return data
  },

  async createTag(tagData) {
    const { data, error } = await supabase
      .from('tags')
      .insert(tagData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTag(tagId, updates) {
    const { data, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', tagId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteTag(tagId) {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId)

    if (error) throw error
  },
}
