import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Export quote data to PDF using jsPDF + html2canvas
 * @param {Object} quoteData - Complete quote data object
 * @returns {Promise<boolean>} - Success status
 */
export async function exportToPDF(quoteData) {
  // Validate data
  if (!quoteData.items || quoteData.items.length === 0) {
    throw new Error('請至少新增一個報價項目')
  }
  
  if (!quoteData.customer || !quoteData.customer.name) {
    throw new Error('請輸入客戶名稱')
  }
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..+/, '')
    .slice(0, 15)
  const filename = `quotation_${timestamp}.pdf`
  
  // Get PDF preview element
  const element = document.getElementById('pdf-preview')
  if (!element) {
    throw new Error('找不到 PDF 預覽元素')
  }
  
  try {
    console.log('開始生成 PDF...')
    console.log('PDF 預覽元素:', element)
    
    // Temporarily show element for rendering
    element.style.visibility = 'visible'
    element.style.position = 'absolute'
    element.style.left = '0'
    element.style.top = '0'
    
    // Wait a bit for rendering
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Convert HTML to canvas
    console.log('正在將 HTML 轉換為 Canvas...')
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff'
    })
    
    // Hide element again
    element.style.visibility = 'hidden'
    element.style.position = 'fixed'
    
    console.log('Canvas 生成成功，尺寸:', canvas.width, 'x', canvas.height)
    
    // Calculate PDF dimensions
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.98)
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
    
    // Save PDF
    pdf.save(filename)
    
    console.log('PDF 已成功生成並下載:', filename)
    return true
    
  } catch (error) {
    // Make sure to hide element even if error occurs
    element.style.visibility = 'hidden'
    element.style.position = 'fixed'
    
    console.error('PDF export failed:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    throw new Error(`PDF 匯出失敗：${error.message}`)
  }
}
