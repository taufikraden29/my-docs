// Calculate reading time based on word count
// Average reading speed: 200 words per minute

export const calculateReadingTime = (text) => {
  if (!text) return 0

  // Remove markdown syntax for accurate word count
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/#{1,6}\s/g, '') // Remove heading markers
    .replace(/[*_~[\]()]/g, '') // Remove markdown formatting
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .trim()

  // Count words
  const words = cleanText.split(/\s+/).length
  
  // Calculate reading time (200 words per minute)
  const minutes = Math.ceil(words / 200)
  
  return minutes
}

// Format reading time
export const formatReadingTime = (text) => {
  const minutes = calculateReadingTime(text)
  
  if (minutes === 0) return '< 1 min read'
  if (minutes === 1) return '1 min read'
  return `${minutes} min read`
}

// Get word count
export const getWordCount = (text) => {
  if (!text) return 0
  
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[*_~[\]()]/g, '')
    .trim()
  
  return cleanText.split(/\s+/).length
}
