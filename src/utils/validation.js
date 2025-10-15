// Validation utility functions

/**
 * Validate customer name
 * @param {string} name - Customer name
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateCustomerName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: '請輸入客戶名稱' }
  }
  if (name.length > 100) {
    return { valid: false, message: '客戶名稱不可超過 100 字元' }
  }
  return { valid: true, message: '' }
}

/**
 * Validate email format (optional field)
 * @param {string} email - Email address
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return { valid: true, message: '' } // Email is optional
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Email 格式不正確' }
  }
  
  return { valid: true, message: '' }
}

/**
 * Validate item description
 * @param {string} description - Item description
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateItemDescription(description) {
  if (!description || description.trim().length === 0) {
    return { valid: false, message: '請輸入品項名稱' }
  }
  if (description.length > 200) {
    return { valid: false, message: '品項名稱不可超過 200 字元' }
  }
  return { valid: true, message: '' }
}

/**
 * Validate quantity (must be > 0)
 * @param {number} quantity - Item quantity
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateQuantity(quantity) {
  const num = Number(quantity)
  if (isNaN(num) || num <= 0) {
    return { valid: false, message: '數量必須大於零' }
  }
  return { valid: true, message: '' }
}

/**
 * Validate unit price (must be > 0)
 * @param {number} unitPrice - Item unit price
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateUnitPrice(unitPrice) {
  const num = Number(unitPrice)
  if (isNaN(num) || num <= 0) {
    return { valid: false, message: '單價必須大於零' }
  }
  return { valid: true, message: '' }
}

/**
 * Validate quote data before export
 * @param {Object} quoteData - Complete quote data
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateQuoteForExport(quoteData) {
  // Check if customer name exists
  const nameValidation = validateCustomerName(quoteData.customer?.name)
  if (!nameValidation.valid) {
    return nameValidation
  }
  
  // Check if at least one item exists
  if (!quoteData.items || quoteData.items.length === 0) {
    return { valid: false, message: '請至少新增一個報價項目' }
  }
  
  // Validate all items
  for (let i = 0; i < quoteData.items.length; i++) {
    const item = quoteData.items[i]
    
    const descValidation = validateItemDescription(item.description)
    if (!descValidation.valid) {
      return { valid: false, message: `項目 ${i + 1}: ${descValidation.message}` }
    }
    
    const qtyValidation = validateQuantity(item.quantity)
    if (!qtyValidation.valid) {
      return { valid: false, message: `項目 ${i + 1}: ${qtyValidation.message}` }
    }
    
    const priceValidation = validateUnitPrice(item.unitPrice)
    if (!priceValidation.valid) {
      return { valid: false, message: `項目 ${i + 1}: ${priceValidation.message}` }
    }
  }
  
  return { valid: true, message: '' }
}
