import { supabase } from '../lib/supabase'

export const categoryService = {
  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  async getCategoriesWithCount() {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        posts(count)
      `)
      .order('name')

    if (error) throw error
    return data
  },

  async createCategory(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateCategory(categoryId, updates) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteCategory(categoryId) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) throw error
  },
}
