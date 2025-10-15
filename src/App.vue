<script setup>
import { computed } from 'vue'
import { useLocalQuote } from './composables/useLocalQuote'
import { exportToPDF } from './utils/exportPDF'
import { exportToCSV } from './utils/exportCSV'
import EmptyState from './components/EmptyState.vue'
import QuoteEditor from './components/QuoteEditor.vue'
import ItemTable from './components/ItemTable.vue'
import ExportControls from './components/ExportControls.vue'

const { quoteData, clearQuote, addItem, removeItem, updateItemTotal } = useLocalQuote()

const hasItems = computed(() => {
  return quoteData.value.items.length > 0
})

const totalAmount = computed(() => {
  return quoteData.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
})

// Format number with thousand separators
function formatNumber(num) {
  return new Intl.NumberFormat('zh-TW').format(num)
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Handle PDF export
async function handleExportPDF() {
  try {
    console.log('開始匯出 PDF...', quoteData.value)
    await exportToPDF(quoteData.value)
    console.log('PDF 匯出成功')
    clearQuote()
    alert('✅ PDF 匯出成功！資料已清除')
  } catch (error) {
    console.error('PDF 匯出失敗:', error)
    alert('❌ ' + error.message)
  }
}

// Handle CSV export
function handleExportCSV() {
  try {
    console.log('開始匯出 CSV...', quoteData.value)
    exportToCSV(quoteData.value)
    console.log('CSV 匯出成功')
    clearQuote()
    alert('✅ CSV 匯出成功！資料已清除')
  } catch (error) {
    console.error('CSV 匯出失敗:', error)
    alert('❌ ' + error.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <header class="mb-12">
        <h1 class="text-4xl font-semibold text-gray-800 mb-3">報價單</h1>
        <p class="text-gray-500 text-lg">快速建立專業報價單，支援 PDF 與 CSV 匯出</p>
      </header>
      
      <EmptyState v-if="!hasItems" @add-item="addItem" />
      
      <div v-else class="space-y-6">
        <QuoteEditor 
          v-model:customer="quoteData.customer" 
          v-model:notes="quoteData.notes"
        />
        
        <ItemTable 
          :items="quoteData.items"
          @add-item="addItem"
          @remove-item="removeItem"
          @update-total="updateItemTotal"
        />
        
        <ExportControls 
          @export-pdf="handleExportPDF"
          @export-csv="handleExportCSV"
        />
      </div>
      
      <!-- Hidden PDF Preview Template -->
      <div id="pdf-preview" style="position: fixed; left: 0; top: 0; width: 800px; visibility: hidden; pointer-events: none; z-index: -1; background: white;">
        <div style="font-family: 'Microsoft JhengHei', 'Noto Sans TC', sans-serif; padding: 20px; width: 100%; box-sizing: border-box;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px;">
            <h1 style="font-size: 32px; color: #1e40af; margin: 0 0 10px 0; font-weight: bold;">報價單</h1>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">QUOTATION</p>
          </div>
          
          <!-- Customer Info -->
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #374151; margin-bottom: 15px; font-weight: bold; border-left: 4px solid #2563eb; padding-left: 10px;">客戶資訊</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr>
                  <td style="padding: 8px 0; width: 120px; color: #6b7280; font-weight: 500;">客戶名稱：</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">{{ quoteData.customer.name }}</td>
                </tr>
                <tr v-if="quoteData.customer.email">
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Email：</td>
                  <td style="padding: 8px 0; color: #1f2937;">{{ quoteData.customer.email }}</td>
                </tr>
                <tr v-if="quoteData.customer.phone">
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">聯絡電話：</td>
                  <td style="padding: 8px 0; color: #1f2937;">{{ quoteData.customer.phone }}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">報價日期：</td>
                  <td style="padding: 8px 0; color: #1f2937;">{{ formatDate(quoteData.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Items Table -->
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #374151; margin-bottom: 15px; font-weight: bold; border-left: 4px solid #2563eb; padding-left: 10px;">報價項目</h2>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">品項名稱</th>
                  <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 80px;">數量</th>
                  <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 120px;">單價</th>
                  <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 120px;">小計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in quoteData.items" :key="item.id">
                  <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #1f2937;">{{ item.description }}</td>
                  <td style="padding: 10px 12px; text-align: right; border: 1px solid #e5e7eb; color: #1f2937;">{{ item.quantity }}</td>
                  <td style="padding: 10px 12px; text-align: right; border: 1px solid #e5e7eb; color: #1f2937;">NT$ {{ formatNumber(item.unitPrice) }}</td>
                  <td style="padding: 10px 12px; text-align: right; border: 1px solid #e5e7eb; color: #1f2937; font-weight: 500;">NT$ {{ formatNumber(item.total) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style="background-color: #eff6ff;">
                  <td colspan="3" style="padding: 15px 12px; text-align: right; border: 1px solid #e5e7eb; font-weight: bold; color: #1e40af; font-size: 16px;">總金額</td>
                  <td style="padding: 15px 12px; text-align: right; border: 1px solid #e5e7eb; font-weight: bold; color: #1e40af; font-size: 18px;">NT$ {{ formatNumber(totalAmount) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <!-- Notes -->
          <div v-if="quoteData.notes" style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #374151; margin-bottom: 15px; font-weight: bold; border-left: 4px solid #2563eb; padding-left: 10px;">備註</h2>
            <div style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; color: #374151; line-height: 1.6; white-space: pre-wrap;">{{ quoteData.notes }}</div>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">本報價單由報價單工具自動產生</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
