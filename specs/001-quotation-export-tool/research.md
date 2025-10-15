# Phase 0: Research & Technology Decisions

**Feature**: 報價單匯出工具  
**Date**: 2025-10-15  
**Status**: Complete

## Overview

本文件記錄技術選型研究結果與決策理由，所有技術選擇皆符合專案憲法規範。

## Technology Stack Research

### 1. 前端框架：Vue 3 Composition API

**Decision**: 使用 Vue 3 Composition API

**Rationale**:
- 憲法明確規定使用 Vue 3 Composition API，禁止 Options API
- Composition API 提供更好的程式碼組織與重用性
- 響應式系統（`ref`、`reactive`）適合處理報價單即時計算需求
- `watch` 與 `watchEffect` 可輕鬆實現自動儲存至 localStorage

**Best Practices**:
- 使用 `<script setup>` 語法簡化元件撰寫
- 將可重用邏輯抽取為 composables（如 `useLocalQuote.js`）
- 使用 `computed` 處理衍生狀態（如總金額計算）
- 避免過度使用 `reactive`，優先使用 `ref` 以避免響應式遺失問題

**Alternatives Considered**:
- React: 憲法允許但 Vue 3 更適合本專案需求（更簡潔的模板語法）
- Vue 2: 已過時，不支援 Composition API
- Options API: 憲法明確禁止

### 2. 樣式系統：Tailwind CSS v4

**Decision**: 使用 Tailwind CSS v4

**Rationale**:
- 憲法明確規定使用 Tailwind CSS v4
- Utility-first 方法加速開發，無需撰寫自訂 CSS
- 內建響應式設計工具類別（`sm:`、`md:`、`lg:`）
- 與 Vue 3 整合良好，支援動態類別綁定

**Configuration**:
```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
      }
    }
  },
  plugins: []
}
```

**Best Practices**:
- 使用 `@apply` 指令整合常用樣式組合（謹慎使用，避免違反 utility-first 原則）
- 利用 Tailwind 的響應式前綴實現跨裝置支援
- 使用 `dark:` 前綴支援深色模式（可選）

**Alternatives Considered**:
- Bootstrap: 憲法禁止使用其他 CSS 框架
- 自訂 CSS: 開發速度慢，不符合專案需求

### 3. 圖示庫：Heroicons

**Decision**: 使用 @heroicons/vue

**Rationale**:
- 憲法明確規定使用 Heroicons，禁止 emoji
- 提供 Vue 3 官方套件，整合簡單
- 包含 outline 與 solid 兩種風格
- 所有圖示為 SVG 格式，可自訂顏色與尺寸

**Usage Example**:
```vue
<script setup>
import { PlusIcon, TrashIcon, DocumentArrowDownIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <button>
    <PlusIcon class="w-5 h-5" />
    新增項目
  </button>
</template>
```

**Best Practices**:
- 使用 outline 版本作為主要圖示（24x24）
- 按鈕與互動元素使用適當尺寸（`w-5 h-5` 或 `w-6 h-6`）
- 利用 Tailwind 類別控制圖示顏色（`text-blue-500`）

### 4. PDF 匯出：html2pdf.js

**Decision**: 使用 html2pdf.js

**Rationale**:
- 憲法明確規定使用 html2pdf.js
- 可將 HTML DOM 直接轉換為 PDF，保留樣式
- 支援中文字型嵌入（避免亂碼）
- 無需後端處理，完全在瀏覽器端運作

**Configuration**:
```js
const options = {
  margin: 10,
  filename: `quotation_${timestamp}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
}
```

**Chinese Font Support**:
- 使用 Google Fonts 的 Noto Sans TC 或系統字型
- 確保 PDF 生成前字型已載入完成
- 測試所有主流瀏覽器的中文顯示

**Best Practices**:
- 建立專用的 PDF 預覽元件（隱藏於畫面外）
- 使用 `html2canvas` 的 `useCORS` 選項處理跨域圖片
- 匯出前驗證內容完整性

**Alternatives Considered**:
- jsPDF: 需手動繪製 PDF 內容，開發複雜度高
- pdfmake: 憲法未指定，且學習曲線較陡

### 5. CSV 匯出：papaparse

**Decision**: 使用 papaparse

**Rationale**:
- 憲法明確規定使用 papaparse
- 支援 CSV 生成與解析
- 正確處理中文字元編碼（UTF-8 BOM）
- 簡單易用的 API

**Usage Example**:
```js
import Papa from 'papaparse'

const csv = Papa.unparse({
  fields: ['品項名稱', '數量', '單價', '小計'],
  data: items.map(item => [
    item.description,
    item.quantity,
    item.unitPrice,
    item.total
  ])
})

// 加入 UTF-8 BOM 確保 Excel 正確顯示中文
const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
```

**Best Practices**:
- 加入 UTF-8 BOM（`\ufeff`）確保 Excel 正確開啟
- 使用明確的欄位標題（正體中文）
- 檔名包含時間戳避免覆蓋

**Alternatives Considered**:
- 手動字串拼接: 容易出錯，不處理特殊字元
- json2csv: 憲法未指定

### 6. 狀態管理：localStorage + Composition API

**Decision**: 使用 localStorage 搭配 Vue 3 Composition API

**Rationale**:
- 憲法明確規定使用 localStorage，禁止後端儲存
- 無需引入 Vuex 或 Pinia（專案規模小，過度工程化）
- 使用 composable 封裝 localStorage 邏輯，提供響應式介面

**Implementation Pattern**:
```js
// useLocalQuote.js
import { ref, watch } from 'vue'

const STORAGE_KEY = 'quoteData'

export function useLocalQuote() {
  const quoteData = ref(loadFromStorage())
  
  // 自動儲存
  watch(quoteData, (newData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  }, { deep: true })
  
  function clearQuote() {
    localStorage.removeItem(STORAGE_KEY)
    quoteData.value = getEmptyQuote()
  }
  
  return { quoteData, clearQuote }
}
```

**Best Practices**:
- 使用 `watch` 的 `deep` 選項監聽巢狀物件變更
- 加入 debounce 避免過度頻繁寫入（500ms）
- 處理 localStorage 配額超限錯誤
- 驗證載入的資料格式，損毀時重設

**Alternatives Considered**:
- Vuex: 過度複雜，本專案不需要
- Pinia: 同樣過度工程化
- IndexedDB: 憲法規定使用 localStorage

### 7. 建置工具：Vite

**Decision**: 使用 Vite

**Rationale**:
- Vue 3 官方推薦的建置工具
- 開發伺服器啟動速度極快（ESM 原生支援）
- 內建 HMR（Hot Module Replacement）
- 生產環境使用 Rollup 打包，產出最佳化

**Configuration**:
```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

**Best Practices**:
- 使用 `base: './'` 支援相對路徑部署
- 設定適當的 `outDir` 與 `assetsDir`
- 利用 Vite 的程式碼分割功能（自動處理）

**Alternatives Considered**:
- Webpack: 設定複雜，啟動速度慢
- Parcel: 生態系不如 Vite 成熟

## Data Model Research

### localStorage 資料結構

**Decision**: 使用憲法定義的 JSON 格式

```json
{
  "customer": {
    "name": "",
    "email": "",
    "phone": ""
  },
  "items": [
    {
      "description": "",
      "quantity": 1,
      "unitPrice": 100,
      "total": 100
    }
  ],
  "notes": "",
  "createdAt": "2025-10-15T00:00:00Z"
}
```

**Rationale**:
- 扁平化結構，易於序列化與反序列化
- 包含所有必要欄位（客戶資訊、項目、備註、時間戳）
- `total` 為衍生欄位，但儲存以避免重新計算

**Validation Rules**:
- `quantity` 與 `unitPrice` 必須 > 0
- `email` 格式驗證（選用）
- `items` 陣列至少包含一個項目（匯出時驗證）

## Performance Optimization Research

### 1. 響應式效能

**Strategy**: 避免不必要的重新渲染

**Techniques**:
- 使用 `v-memo` 指令快取列表項目渲染
- 使用 `computed` 而非 `watch` 處理衍生狀態
- 避免在模板中使用複雜運算

### 2. localStorage 寫入效能

**Strategy**: 使用 debounce 減少寫入頻率

**Implementation**:
```js
import { debounce } from 'lodash-es' // 或自行實作

const debouncedSave = debounce((data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}, 500)
```

### 3. PDF 匯出效能

**Strategy**: 最佳化 DOM 結構與樣式

**Techniques**:
- 簡化 PDF 預覽元件的 DOM 結構
- 避免使用複雜的 CSS 效果（陰影、漸層）
- 使用固定尺寸避免 layout thrashing

## Security & Privacy Research

### 1. 資料隱私

**Approach**: 完全本地化，無外部傳輸

**Guarantees**:
- 所有資料僅存於使用者瀏覽器
- 無 API 呼叫，無資料上傳
- 匯出後立即清除，無殘留

### 2. XSS 防護

**Approach**: Vue 3 自動跳脫

**Best Practices**:
- 避免使用 `v-html`
- 使用者輸入透過 Vue 模板自動跳脫
- 驗證輸入長度避免 DoS

## Browser Compatibility Research

**Target Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Key Features Used**:
- ES6 (全瀏覽器支援)
- localStorage (全瀏覽器支援)
- Blob API (全瀏覽器支援)
- CSS Grid & Flexbox (全瀏覽器支援)

**No Polyfills Required**: 所有目標瀏覽器原生支援所需功能

## Responsive Design Research

**Breakpoints** (Tailwind 預設):
- `sm`: 640px (手機橫向)
- `md`: 768px (平板直向)
- `lg`: 1024px (平板橫向 / 小筆電)
- `xl`: 1280px (桌面)

**Mobile-First Strategy**:
- 預設樣式針對手機（375px 寬度）
- 使用 `md:` 與 `lg:` 前綴調整桌面版面
- 表格在小螢幕使用卡片式版面

**Touch-Friendly**:
- 按鈕最小點擊區域 44x44px
- 輸入欄位足夠大，易於點擊
- 避免 hover 效果（手機無 hover）

## Conclusion

所有技術選型皆符合專案憲法規範，無需額外澄清或例外處理。研究結果確認技術方案可行，可進入 Phase 1 設計階段。
