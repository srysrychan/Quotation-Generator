import Papa from 'papaparse'

/**
 * Export quote data to CSV
 * @param {Object} quoteData - Complete quote data object
 * @returns {boolean} - Success status
 */
export function exportToCSV(quoteData) {
  // Validate data
  if (!quoteData.items || quoteData.items.length === 0) {
    throw new Error('請至少新增一個報價項目')
  }
  
  // Prepare CSV data
  const csvData = {
    fields: ['品項名稱', '數量', '單價', '小計'],
    data: quoteData.items.map(item => [
      item.description,
      item.quantity,
      item.unitPrice,
      item.total
    ])
  }
  
  // Generate CSV string
  const csv = Papa.unparse(csvData)
  
  // Add UTF-8 BOM for Excel compatibility
  const blob = new Blob(['\ufeff' + csv], { 
    type: 'text/csv;charset=utf-8;' 
  })
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..+/, '')
    .slice(0, 15)
  const filename = `quotation_${timestamp}.csv`
  
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
