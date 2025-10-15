import { ref, watch } from 'vue'

const STORAGE_KEY = 'quoteData'

// Factory function for empty quote structure
function getEmptyQuote() {
  return {
    quotationNumber: generateQuotationNumber(),
    validUntil: getDefaultValidUntil(),
    company: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    customer: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    items: [],
    notes: '',
    createdAt: new Date().toISOString()
  }
}

// Generate quotation number (format: Q-YYYYMMDD-XXXX)
function generateQuotationNumber() {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `Q-${dateStr}-${random}`
}

// Get default valid until date (30 days from now)
function getDefaultValidUntil() {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date.toISOString().slice(0, 10)
}

// Load data from localStorage with error handling
function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return getEmptyQuote()
    
    const parsed = JSON.parse(data)
    
    // Validate data structure
    if (!parsed.customer || !Array.isArray(parsed.items)) {
      console.warn('Invalid data structure in localStorage, resetting...')
      throw new Error('Invalid data structure')
    }
    
    // Migrate old data structure to new structure
    const emptyQuote = getEmptyQuote()
    return {
      quotationNumber: parsed.quotationNumber || emptyQuote.quotationNumber,
      validUntil: parsed.validUntil || emptyQuote.validUntil,
      company: {
        name: parsed.company?.name || '',
        address: parsed.company?.address || '',
        phone: parsed.company?.phone || '',
        email: parsed.company?.email || ''
      },
      customer: {
        name: parsed.customer?.name || '',
        email: parsed.customer?.email || '',
        phone: parsed.customer?.phone || '',
        address: parsed.customer?.address || ''
      },
      items: parsed.items || [],
      notes: parsed.notes || '',
      createdAt: parsed.createdAt || emptyQuote.createdAt
    }
  } catch (error) {
    console.error('Failed to load quote data:', error)
    localStorage.removeItem(STORAGE_KEY)
    return getEmptyQuote()
  }
}

export function useLocalQuote() {
  const quoteData = ref(loadFromStorage())
  
  // Auto-save with debounce (500ms)
  let saveTimeout = null
  watch(
    quoteData,
    (newData) => {
      clearTimeout(saveTimeout)
      saveTimeout = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
        } catch (error) {
          console.error('Failed to save quote data:', error)
          if (error.name === 'QuotaExceededError') {
            alert('儲存空間不足，請清除瀏覽器資料後重試')
          }
        }
      }, 500)
    },
    { deep: true }
  )
  
  // Clear quote data
  function clearQuote() {
    localStorage.removeItem(STORAGE_KEY)
    quoteData.value = getEmptyQuote()
  }
  
  // Add new item
  function addItem() {
    const newItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
    quoteData.value.items.push(newItem)
  }
  
  // Remove item by id
  function removeItem(id) {
    const index = quoteData.value.items.findIndex(item => item.id === id)
    if (index !== -1) {
      quoteData.value.items.splice(index, 1)
    }
  }
  
  // Update item total (quantity × unitPrice)
  function updateItemTotal(item) {
    item.total = item.quantity * item.unitPrice
  }
  
  return {
    quoteData,
    clearQuote,
    addItem,
    removeItem,
    updateItemTotal
  }
}
