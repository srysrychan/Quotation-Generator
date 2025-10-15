import Papa from 'papaparse'

/**
 * Format date to YYYY-MM-DD
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

/**
 * Export quote data to CSV with complete information
 * @param {Object} quoteData - Complete quote data object
 * @returns {boolean} - Success status
 */
export function exportToCSV(quoteData) {
  // Validate data
  if (!quoteData.items || quoteData.items.length === 0) {
    throw new Error('請至少新增一個報價項目')
  }
  
  if (!quoteData.customer || !quoteData.customer.name) {
    throw new Error('請填寫客戶名稱')
  }
  
  // Build CSV content manually for better control
  const lines = []
  
  // === 報價單資訊 ===
  lines.push(['報價單資訊', ''])
  lines.push(['報價單編號', quoteData.quotationNumber || ''])
  lines.push(['報價日期', formatDate(quoteData.createdAt)])
  lines.push(['有效期限', formatDate(quoteData.validUntil)])
  lines.push(['']) // Empty line
  
  // === 報價方資訊 ===
  if (quoteData.company && (quoteData.company.name || quoteData.company.address || quoteData.company.phone || quoteData.company.email)) {
    lines.push(['報價方', ''])
    if (quoteData.company.name) lines.push(['公司名稱', quoteData.company.name])
    if (quoteData.company.address) lines.push(['公司地址', quoteData.company.address])
    if (quoteData.company.phone) lines.push(['公司電話', quoteData.company.phone])
    if (quoteData.company.email) lines.push(['公司Email', quoteData.company.email])
    lines.push(['']) // Empty line
  }
  
  // === 客戶資訊 ===
  lines.push(['客戶', ''])
  lines.push(['客戶名稱', quoteData.customer.name])
  if (quoteData.customer.address) lines.push(['客戶地址', quoteData.customer.address])
  if (quoteData.customer.phone) lines.push(['聯絡電話', quoteData.customer.phone])
  if (quoteData.customer.email) lines.push(['Email', quoteData.customer.email])
  lines.push(['']) // Empty line
  
  // === 報價項目 ===
  lines.push(['報價項目', '', '', ''])
  lines.push(['品項名稱', '數量', '單價', '小計'])
  
  // Calculate total
  let totalAmount = 0
  quoteData.items.forEach(item => {
    lines.push([
      item.description || '',
      item.quantity || 0,
      item.unitPrice || 0,
      item.total || 0
    ])
    totalAmount += item.total || 0
  })
  
  lines.push(['']) // Empty line
  lines.push(['總金額', '', '', totalAmount])
  
  // === 備註 ===
  if (quoteData.notes && quoteData.notes.trim()) {
    lines.push(['']) // Empty line
    lines.push(['備註', ''])
    // Split notes by newline and add each line
    const noteLines = quoteData.notes.split('\n')
    noteLines.forEach(line => {
      lines.push([line])
    })
  }
  
  // Generate CSV string using papaparse
  const csv = Papa.unparse(lines)
  
  // Add UTF-8 BOM for Excel compatibility
  const blob = new Blob(['\ufeff' + csv], { 
    type: 'text/csv;charset=utf-8;' 
  })
  
  // Generate filename with quotation number or timestamp
  let filename
  if (quoteData.quotationNumber) {
    filename = `${quoteData.quotationNumber}.csv`
  } else {
    const timestamp = new Date().toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .slice(0, 15)
    filename = `quotation_${timestamp}.csv`
  }
  
  // Create download link and trigger download
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
  
  console.log('CSV 已成功生成並下載:', filename)
  return true
}
