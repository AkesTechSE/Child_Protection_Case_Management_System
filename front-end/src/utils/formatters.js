export const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return 'Invalid date'
  }
}

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatPercentage = (value) => {
  if (value === null || value === undefined) return ''
  return `${(value * 100).toFixed(1)}%`
}