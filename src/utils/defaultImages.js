// Default images berdasarkan kategori blog
// Menggunakan gradient SVG untuk tampilan modern dan profesional

export const getDefaultImage = (categoryName) => {
  const category = categoryName?.toLowerCase() || 'default'
  
  // Map kategori ke gradient colors dan icon
  const categoryThemes = {
    technology: {
      gradient: ['#667eea', '#764ba2'],
      icon: '💻',
      emoji: '⚡'
    },
    programming: {
      gradient: ['#f093fb', '#f5576c'],
      icon: '👨‍💻',
      emoji: '⚙️'
    },
    'web development': {
      gradient: ['#4facfe', '#00f2fe'],
      icon: '🌐',
      emoji: '🚀'
    },
    tutorial: {
      gradient: ['#43e97b', '#38f9d7'],
      icon: '📚',
      emoji: '✨'
    },
    design: {
      gradient: ['#fa709a', '#fee140'],
      icon: '🎨',
      emoji: '✏️'
    },
    lifestyle: {
      gradient: ['#30cfd0', '#330867'],
      icon: '🌟',
      emoji: '💫'
    },
    business: {
      gradient: ['#a8edea', '#fed6e3'],
      icon: '💼',
      emoji: '📊'
    },
    travel: {
      gradient: ['#ff9a9e', '#fecfef'],
      icon: '✈️',
      emoji: '🗺️'
    },
    food: {
      gradient: ['#ffecd2', '#fcb69f'],
      icon: '🍔',
      emoji: '🍕'
    },
    health: {
      gradient: ['#a1c4fd', '#c2e9fb'],
      icon: '🏥',
      emoji: '💪'
    },
    news: {
      gradient: ['#fccb90', '#d57eeb'],
      icon: '📰',
      emoji: '📢'
    },
    default: {
      gradient: ['#89f7fe', '#66a6ff'],
      icon: '📝',
      emoji: '📄'
    }
  }

  // Cari tema yang cocok atau gunakan default
  const theme = categoryThemes[category] || categoryThemes.default

  // Generate SVG dengan gradient
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.gradient[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${theme.gradient[1]};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad)" />
      <text x="50%" y="45%" text-anchor="middle" font-size="120" fill="white" opacity="0.9">
        ${theme.icon}
      </text>
      <text x="50%" y="65%" text-anchor="middle" font-size="48" font-weight="bold" fill="white" font-family="Arial, sans-serif">
        ${categoryName || 'Blog Post'}
      </text>
    </svg>
  `

  // Convert SVG to data URL
  const encodedSvg = encodeURIComponent(svg.trim())
  return `data:image/svg+xml,${encodedSvg}`
}

// Fungsi untuk cek apakah image URL valid
export const hasValidImage = (imageUrl) => {
  return imageUrl && imageUrl.trim() !== '' && !imageUrl.startsWith('data:image/svg+xml')
}

// Fungsi untuk get image dengan fallback
export const getImageOrDefault = (imageUrl, categoryName) => {
  if (hasValidImage(imageUrl)) {
    return imageUrl
  }
  return getDefaultImage(categoryName)
}

// Export category themes untuk reference
export const CATEGORY_THEMES = {
  technology: '💻 Technology - Blue Purple Gradient',
  programming: '👨‍💻 Programming - Pink Red Gradient',
  'web development': '🌐 Web Development - Light Blue Gradient',
  tutorial: '📚 Tutorial - Green Cyan Gradient',
  design: '🎨 Design - Pink Yellow Gradient',
  lifestyle: '🌟 Lifestyle - Cyan Purple Gradient',
  business: '💼 Business - Soft Pastel Gradient',
  travel: '✈️ Travel - Pink Gradient',
  food: '🍔 Food - Orange Peach Gradient',
  health: '🏥 Health - Blue Sky Gradient',
  news: '📰 News - Orange Purple Gradient',
  default: '📝 Default - Cyan Blue Gradient'
}
