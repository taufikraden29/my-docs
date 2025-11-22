import slugifyLib from 'slugify'

export const slugify = (text) => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
