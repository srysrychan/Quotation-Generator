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
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Logo -->
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">報價單工具</h1>
              <p class="text-xs text-gray-500">Quotation Generator</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <!-- GitHub Icon -->
            <a 
              href="https://github.com/zz41354899/Quote-web" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors group"
              title="GitHub Repository"
            >
              <svg class="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-4xl mx-auto px-6 py-12">
        <div class="mb-8">
          <h2 class="text-3xl font-semibold text-gray-800 mb-2">建立報價單</h2>
          <p class="text-gray-500">快速建立專業報價單，支援 PDF 與 CSV 匯出</p>
        </div>
      
      <EmptyState v-if="!hasItems" @add-item="addItem" />
      
      <div v-else class="space-y-6">
        <QuoteEditor 
          v-model:quotationNumber="quoteData.quotationNumber"
          v-model:validUntil="quoteData.validUntil"
          v-model:company="quoteData.company"
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
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-4xl mx-auto px-6 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-3">
          <div class="text-center md:text-left">
            <p class="text-sm text-gray-600 mb-1">報價單工具 - 快速建立專業報價單</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-xs text-gray-400">© 2025</span>
          </div>
        </div>
      </div>
    </footer>
      
      <!-- Hidden PDF Preview Template -->
      <div id="pdf-preview" style="position: fixed; left: 0; top: 0; width: 800px; visibility: hidden; pointer-events: none; z-index: -1; background: white;">
        <div style="font-family: 'Microsoft JhengHei', 'Noto Sans TC', sans-serif; padding: 40px; width: 100%; box-sizing: border-box;">
          
          <!-- Header with Quote Number -->
          <div style="margin-bottom: 40px;">
            <h1 style="font-size: 36px; color: #111827; margin: 0 0 8px 0; font-weight: 600; letter-spacing: -0.5px;">報價單</h1>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 2px solid #e5e7eb;">
              <div style="margin-top: 12px;">
                <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px 0;">報價單編號</p>
                <p style="font-size: 16px; color: #111827; margin: 0; font-weight: 600;">{{ quoteData.quotationNumber }}</p>
              </div>
              <div style="text-align: right; margin-top: 12px;">
                <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px 0;">報價日期</p>
                <p style="font-size: 14px; color: #111827; margin: 0;">{{ formatDate(quoteData.createdAt) }}</p>
              </div>
            </div>
            <div style="text-align: right; margin-top: 8px;">
              <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px 0;">有效期限</p>
              <p style="font-size: 14px; color: #111827; margin: 0;">{{ formatDate(quoteData.validUntil) }}</p>
            </div>
          </div>
          
          <!-- Company and Customer Info Side by Side -->
          <div style="display: flex; gap: 30px; margin-bottom: 40px;">
            <!-- Company Info -->
            <div style="flex: 1; background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h2 style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">報價方</h2>
              <div v-if="quoteData.company.name" style="margin-bottom: 12px;">
                <p style="font-size: 16px; color: #111827; margin: 0; font-weight: 600;">{{ quoteData.company.name }}</p>
              </div>
              <div v-if="quoteData.company.address" style="margin-bottom: 8px;">
                <p style="font-size: 13px; color: #6b7280; margin: 0 0 2px 0;">地址</p>
                <p style="font-size: 14px; color: #374151; margin: 0;">{{ quoteData.company.address }}</p>
              </div>
              <div v-if="quoteData.company.phone" style="margin-bottom: 8px;">
                <p style="font-size: 13px; color: #6b7280; margin: 0 0 2px 0;">電話</p>
                <p style="font-size: 14px; color: #374151; margin: 0;">{{ quoteData.company.phone }}</p>
              </div>
              <div v-if="quoteData.company.email">
                <p style="font-size: 13px; color: #6b7280; margin: 0 0 2px 0;">Email</p>
                <p style="font-size: 14px; color: #374151; margin: 0;">{{ quoteData.company.email }}</p>
              </div>
            </div>
            
            <!-- Customer Info -->
            <div style="flex: 1; background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h2 style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">客戶</h2>
              <div style="margin-bottom: 12px;">
                <p style="font-size: 16px; color: #111827; margin: 0; font-weight: 600;">{{ quoteData.customer.name }}</p>
              </div>
              <div v-if="quoteData.customer.address" style="margin-bottom: 8px;">
                <p style="font-size: 13px; color: #6b7280; margin: 0 0 2px 0;">地址</p>
                <p style="font-size: 14px; color: #374151; margin: 0;">{{ quoteData.customer.address }}</p>
              </div>
              <div v-if="quoteData.customer.phone" style="margin-bottom: 8px;">
                <p style="font-size: 13px; color: #6b7280; margin: 0 0 2px 0;">電話</p>
                <p style="font-size: 14px; color: #374151; margin: 0;">{{ quoteData.customer.phone }}</p>
              </div>
              <div v-if="quoteData.customer.email">
                <p style="font-size: 13px; color: #6b7280; margin: 0 0 2px 0;">Email</p>
                <p style="font-size: 14px; color: #374151; margin: 0;">{{ quoteData.customer.email }}</p>
              </div>
            </div>
          </div>
          
          <!-- Items Table -->
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">報價項目</h2>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background-color: #f9fafb;">
                  <th style="padding: 14px 16px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">品項名稱</th>
                  <th style="padding: 14px 16px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; width: 80px;">數量</th>
                  <th style="padding: 14px 16px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">單價</th>
                  <th style="padding: 14px 16px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">小計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in quoteData.items" :key="item.id" style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 14px 16px; color: #111827; font-size: 14px;">{{ item.description }}</td>
                  <td style="padding: 14px 16px; text-align: right; color: #374151; font-size: 14px;">{{ item.quantity }}</td>
                  <td style="padding: 14px 16px; text-align: right; color: #374151; font-size: 14px;">NT$ {{ formatNumber(item.unitPrice) }}</td>
                  <td style="padding: 14px 16px; text-align: right; color: #111827; font-size: 14px; font-weight: 500;">NT$ {{ formatNumber(item.total) }}</td>
                </tr>
              </tbody>
            </table>
            
            <!-- Total -->
            <div style="margin-top: 20px; padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 16px; color: #6b7280; font-weight: 600;">總金額</span>
                <span style="font-size: 24px; color: #111827; font-weight: 700;">NT$ {{ formatNumber(totalAmount) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Notes -->
          <div v-if="quoteData.notes" style="margin-bottom: 40px;">
            <h2 style="font-size: 14px; color: #6b7280; margin: 0 0 12px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">備註</h2>
            <div style="padding: 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; line-height: 1.7; font-size: 14px; white-space: pre-wrap;">{{ quoteData.notes }}</div>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="margin: 0; color: #9ca3af; font-size: 11px;">本報價單由報價單工具自動產生</p>
          </div>
        </div>
      </div>
  </div>
</template>
