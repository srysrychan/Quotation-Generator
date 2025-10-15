# Quickstart Guide: 報價單匯出工具

**Feature**: 報價單匯出工具  
**Date**: 2025-10-15  
**Audience**: 開發者

## 專案概述

報價單匯出工具是一個純前端的單頁應用程式（SPA），使用 Vue 3 + Tailwind CSS 建立。使用者可以快速建立報價單、編輯客戶資訊與報價項目、並匯出為 PDF 或 CSV 格式。所有資料暫存於瀏覽器 localStorage，無需後端伺服器。

## 技術棧

- **前端框架**: Vue 3 (Composition API)
- **樣式系統**: Tailwind CSS v4
- **建置工具**: Vite
- **PDF 匯出**: html2pdf.js
- **CSV 匯出**: papaparse
- **圖示庫**: @heroicons/vue
- **程式語言**: JavaScript ES6（禁止 TypeScript）

## 前置需求

- Node.js 18+ 或 20+
- npm 或 pnpm
- 現代瀏覽器（Chrome、Firefox、Safari、Edge）

## 安裝步驟

### 1. 建立專案

```bash
# 使用 Vite 建立 Vue 3 專案
npm create vite@latest Quote-web -- --template vue

# 進入專案目錄
cd Quote-web

# 安裝基礎相依性
npm install
```

### 2. 安裝 Tailwind CSS v4

```bash
# 安裝 Tailwind CSS 與相關工具
npm install -D tailwindcss@next @tailwindcss/postcss@next postcss autoprefixer

# 初始化 Tailwind 設定
npx tailwindcss init
```

**設定 `tailwind.config.js`**:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**設定 `postcss.config.js`**:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

**在 `src/style.css` 中引入 Tailwind**:
```css
@import "tailwindcss";
```

### 3. 安裝功能相依性

```bash
# PDF 匯出
npm install html2pdf.js

# CSV 匯出
npm install papaparse

# 圖示庫
npm install @heroicons/vue
```

### 4. 建立專案結構

```bash
# 建立目錄結構
mkdir -p src/components src/utils src/composables public/assets

# 建立元件檔案
touch src/components/QuoteEditor.vue
touch src/components/ItemTable.vue
touch src/components/ExportControls.vue
touch src/components/EmptyState.vue

# 建立工具函式
touch src/utils/exportPDF.js
touch src/utils/exportCSV.js
touch src/utils/validation.js

# 建立 composable
touch src/composables/useLocalQuote.js
```

## 專案結構

```
Quote-web/
├── src/
│   ├── components/
│   │   ├── QuoteEditor.vue      # 客戶資訊與備註編輯
│   │   ├── ItemTable.vue        # 報價項目表格
│   │   ├── ExportControls.vue   # 匯出按鈕
│   │   └── EmptyState.vue       # 空白狀態引導
│   ├── utils/
│   │   ├── exportPDF.js         # PDF 匯出邏輯
│   │   ├── exportCSV.js         # CSV 匯出邏輯
│   │   └── validation.js        # 輸入驗證
│   ├── composables/
│   │   └── useLocalQuote.js     # localStorage 管理
│   ├── App.vue                  # 主應用程式
│   ├── main.js                  # 進入點
│   └── style.css                # 全域樣式
├── public/
│   ├── index.html
│   └── assets/
│       └── logo.png             # 公司 LOGO（PDF 用）
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 核心實作指引

### 1. localStorage 管理 (`useLocalQuote.js`)

```js
import { ref, watch } from 'vue'

const STORAGE_KEY = 'quoteData'

function getEmptyQuote() {
  return {
    customer: { name: '', email: '', phone: '' },
    items: [],
    notes: '',
    createdAt: new Date().toISOString()
  }
}

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return getEmptyQuote()
    
    const parsed = JSON.parse(data)
    // 驗證資料結構
    if (!parsed.customer || !Array.isArray(parsed.items)) {
      throw new Error('Invalid data structure')
    }
    return parsed
  } catch (error) {
    console.error('Failed to load quote data:', error)
    return getEmptyQuote()
  }
}

export function useLocalQuote() {
  const quoteData = ref(loadFromStorage())
  
  // 自動儲存（debounced）
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
  
  function clearQuote() {
    localStorage.removeItem(STORAGE_KEY)
    quoteData.value = getEmptyQuote()
  }
  
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
  
  function removeItem(id) {
    const index = quoteData.value.items.findIndex(item => item.id === id)
    if (index !== -1) {
      quoteData.value.items.splice(index, 1)
    }
  }
  
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
```

### 2. PDF 匯出 (`exportPDF.js`)

```js
import html2pdf from 'html2pdf.js'

export async function exportToPDF(quoteData) {
  // 驗證資料
  if (!quoteData.items || quoteData.items.length === 0) {
    throw new Error('請至少新增一個報價項目')
  }
  
  // 產生檔名（包含時間戳）
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '')
    .slice(0, 15)
  const filename = `quotation_${timestamp}.pdf`
  
  // 取得要匯出的 DOM 元素
  const element = document.getElementById('pdf-preview')
  if (!element) {
    throw new Error('找不到 PDF 預覽元素')
  }
  
  // PDF 設定
  const options = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  }
  
  try {
    await html2pdf().set(options).from(element).save()
    return true
  } catch (error) {
    console.error('PDF export failed:', error)
    throw new Error('匯出失敗，請重試')
  }
}
```

### 3. CSV 匯出 (`exportCSV.js`)

```js
import Papa from 'papaparse'

export function exportToCSV(quoteData) {
  // 驗證資料
  if (!quoteData.items || quoteData.items.length === 0) {
    throw new Error('請至少新增一個報價項目')
  }
  
  // 準備 CSV 資料
  const csvData = {
    fields: ['品項名稱', '數量', '單價', '小計'],
    data: quoteData.items.map(item => [
      item.description,
      item.quantity,
      item.unitPrice,
      item.total
    ])
  }
  
  // 產生 CSV 字串
  const csv = Papa.unparse(csvData)
  
  // 加入 UTF-8 BOM 確保 Excel 正確顯示中文
  const blob = new Blob(['\ufeff' + csv], { 
    type: 'text/csv;charset=utf-8;' 
  })
  
  // 產生檔名（包含時間戳）
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '')
    .slice(0, 15)
  const filename = `quotation_${timestamp}.csv`
  
  // 觸發下載
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  
  // 清理
  URL.revokeObjectURL(link.href)
}
```

### 4. 主應用程式 (`App.vue`)

```vue
<script setup>
import { computed } from 'vue'
import { useLocalQuote } from './composables/useLocalQuote'
import { exportToPDF } from './utils/exportPDF'
import { exportToCSV } from './utils/exportCSV'
import QuoteEditor from './components/QuoteEditor.vue'
import ItemTable from './components/ItemTable.vue'
import ExportControls from './components/ExportControls.vue'
import EmptyState from './components/EmptyState.vue'

const { quoteData, clearQuote, addItem, removeItem, updateItemTotal } = useLocalQuote()

const totalAmount = computed(() => {
  return quoteData.value.items.reduce((sum, item) => sum + item.total, 0)
})

const hasItems = computed(() => {
  return quoteData.value.items.length > 0
})

async function handleExportPDF() {
  try {
    await exportToPDF(quoteData.value)
    clearQuote()
    alert('PDF 匯出成功！')
  } catch (error) {
    alert(error.message)
  }
}

function handleExportCSV() {
  try {
    exportToCSV(quoteData.value)
    clearQuote()
    alert('CSV 匯出成功！')
  } catch (error) {
    alert(error.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">報價單工具</h1>
      
      <EmptyState v-if="!hasItems" @add-item="addItem" />
      
      <div v-else class="space-y-6">
        <QuoteEditor v-model="quoteData.customer" v-model:notes="quoteData.notes" />
        <ItemTable 
          :items="quoteData.items" 
          @add-item="addItem"
          @remove-item="removeItem"
          @update-total="updateItemTotal"
        />
        <div class="text-right text-2xl font-bold">
          總金額: NT$ {{ totalAmount.toLocaleString() }}
        </div>
        <ExportControls 
          @export-pdf="handleExportPDF"
          @export-csv="handleExportCSV"
        />
      </div>
      
      <!-- 隱藏的 PDF 預覽元件 -->
      <div id="pdf-preview" class="hidden">
        <!-- PDF 樣式模板 -->
      </div>
    </div>
  </div>
</template>
```

## 開發指令

```bash
# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 測試檢查清單

### 功能測試

- [ ] 輸入客戶資訊（名稱、Email、電話）
- [ ] 新增報價項目
- [ ] 編輯項目數量與單價，確認小計自動更新
- [ ] 刪除報價項目
- [ ] 總金額正確計算
- [ ] 重新整理頁面，資料自動還原
- [ ] 匯出 PDF，檔案下載成功
- [ ] 開啟 PDF，確認中文無亂碼
- [ ] 匯出 CSV，檔案下載成功
- [ ] 使用 Excel 開啟 CSV，確認中文正常顯示
- [ ] 匯出後，localStorage 已清除
- [ ] 匯出後，畫面回到空白狀態

### 驗證測試

- [ ] 嘗試匯出空白報價單，顯示錯誤訊息
- [ ] 輸入數量為 0，顯示驗證錯誤
- [ ] 輸入單價為負數，顯示驗證錯誤

### 響應式測試

- [ ] 手機螢幕（375px）正常顯示
- [ ] 平板螢幕（768px）正常顯示
- [ ] 桌面螢幕（1920px）正常顯示
- [ ] 所有按鈕在觸控裝置上易於點擊

### 瀏覽器相容性測試

- [ ] Chrome 測試通過
- [ ] Firefox 測試通過
- [ ] Safari 測試通過
- [ ] Edge 測試通過

## 部署

### 靜態網站部署（Netlify / Vercel）

```bash
# 建置專案
npm run build

# dist/ 目錄即為靜態檔案，可直接部署
```

### GitHub Pages 部署

1. 修改 `vite.config.js`，設定 `base`:
```js
export default defineConfig({
  base: '/Quote-web/',
  // ...
})
```

2. 建置並部署:
```bash
npm run build
# 將 dist/ 內容推送至 gh-pages 分支
```

## 常見問題

### Q: PDF 中文顯示亂碼？

A: 確保使用支援中文的字型（如 Noto Sans TC），並在 CSS 中明確指定：
```css
#pdf-preview {
  font-family: 'Noto Sans TC', sans-serif;
}
```

### Q: CSV 在 Excel 中文亂碼？

A: 確保加入 UTF-8 BOM（`\ufeff`）於 CSV 內容開頭。

### Q: localStorage 資料遺失？

A: 檢查瀏覽器隱私模式或儲存空間限制。localStorage 在隱私模式下可能無法使用。

### Q: 匯出失敗但資料被清除？

A: 檢查 `exportPDF.js` 與 `exportCSV.js` 的錯誤處理，確保只有成功時才呼叫 `clearQuote()`。

## 下一步

完成開發後，執行 `/speckit.tasks` 產生詳細的任務清單，並使用 `/speckit.implement` 開始系統化實作。

## 參考資源

- [Vue 3 官方文件](https://vuejs.org/)
- [Tailwind CSS 文件](https://tailwindcss.com/)
- [html2pdf.js 文件](https://github.com/eKoopmans/html2pdf.js)
- [papaparse 文件](https://www.papaparse.com/)
- [Heroicons](https://heroicons.com/)
