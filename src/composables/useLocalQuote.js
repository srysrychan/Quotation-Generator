import { ref, watch } from 'vue'

const STORAGE_KEY = 'quoteData'

// Factory function for empty quote structure
function getEmptyQuote() {
  return {
    customer: {
      name: '',
      email: '',
      phone: ''
    },
    items: [],
    notes: '',
    createdAt: new Date().toISOString()
  }
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
    
    return parsed
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
