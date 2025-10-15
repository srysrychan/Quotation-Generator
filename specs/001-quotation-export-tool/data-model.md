# Phase 1: Data Model

**Feature**: 報價單匯出工具  
**Date**: 2025-10-15  
**Status**: Complete

## Overview

本文件定義報價單系統的資料模型、驗證規則與狀態轉換。所有資料皆儲存於瀏覽器 localStorage，無後端資料庫。

## Core Entities

### 1. Quotation (報價單)

代表一份完整的報價文件，包含客戶資訊、報價項目列表、備註與建立時間。

**Fields**:

| Field Name | Type | Required | Description | Validation |
|------------|------|----------|-------------|------------|
| `customer` | Object | Yes | 客戶資訊物件 | 必須包含 name, email, phone |
| `items` | Array | Yes | 報價項目陣列 | 至少包含一個項目（匯出時驗證） |
| `notes` | String | No | 備註欄位 | 最大長度 2000 字元 |
| `createdAt` | String | Yes | 建立時間戳（ISO 8601） | 自動生成 |

**JSON Schema**:
```json
{
  "customer": {
    "name": "ABC 公司",
    "email": "contact@abc.com",
    "phone": "0912345678"
  },
  "items": [
    {
      "id": "uuid-v4",
      "description": "網站設計",
      "quantity": 1,
      "unitPrice": 50000,
      "total": 50000
    }
  ],
  "notes": "付款條件：簽約後 30 天內付清",
  "createdAt": "2025-10-15T14:30:22.000Z"
}
```

**Business Rules**:
- 報價單必須至少包含一個項目才能匯出
- 匯出成功後，整個 Quotation 物件從 localStorage 刪除
- 匯出失敗時，Quotation 物件保留不變

---

### 2. Customer (客戶資訊)

代表報價單的收件對象資訊。

**Fields**:

| Field Name | Type | Required | Description | Validation |
|------------|------|----------|-------------|------------|
| `name` | String | Yes | 客戶名稱或公司名稱 | 1-100 字元 |
| `email` | String | No | 聯絡人 Email | 有效的 Email 格式（選用驗證） |
| `phone` | String | No | 聯絡電話 | 無特定格式要求 |

**Validation Rules**:
- `name` 為必填欄位，不可為空字串
- `email` 若填寫，應符合基本 Email 格式（包含 `@` 與 `.`）
- `phone` 無格式限制（支援國際電話格式）

**Example**:
```json
{
  "name": "ABC 公司",
  "email": "contact@abc.com",
  "phone": "0912-345-678"
}
```

---

### 3. QuotationItem (報價項目)

代表報價單中的單一項目，包含品項描述、數量、單價與自動計算的小計。

**Fields**:

| Field Name | Type | Required | Description | Validation |
|------------|------|----------|-------------|------------|
| `id` | String | Yes | 項目唯一識別碼（UUID v4） | 自動生成 |
| `description` | String | Yes | 品項名稱或描述 | 1-200 字元 |
| `quantity` | Number | Yes | 數量 | 必須 > 0，整數或小數 |
| `unitPrice` | Number | Yes | 單價 | 必須 > 0 |
| `total` | Number | Yes | 小計（quantity × unitPrice） | 自動計算 |

**Validation Rules**:
- `description` 不可為空字串
- `quantity` 必須大於 0（顯示錯誤訊息：「數量必須大於零」）
- `unitPrice` 必須大於 0（顯示錯誤訊息：「單價必須大於零」）
- `total` 為衍生欄位，由 `quantity × unitPrice` 自動計算

**Calculation**:
```js
total = quantity * unitPrice
```

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "description": "網站設計",
  "quantity": 1,
  "unitPrice": 50000,
  "total": 50000
}
```

---

## Derived Data

### Total Amount (總金額)

報價單的總金額為所有項目 `total` 欄位的加總。

**Calculation**:
```js
totalAmount = items.reduce((sum, item) => sum + item.total, 0)
```

**Display Format**:
- 使用千分位逗號分隔（例如：`66,000`）
- 保留整數或兩位小數（視需求）

---

## State Transitions

### Quotation Lifecycle

```
[Empty State]
    ↓ (使用者開始輸入)
[Editing State]
    ↓ (使用者點擊匯出)
[Exporting State]
    ↓ (匯出成功)
[Cleared State] → 回到 [Empty State]
    ↓ (匯出失敗)
[Editing State] (保留資料)
```

**State Descriptions**:

1. **Empty State (空白狀態)**
   - localStorage 無資料或資料已清除
   - 顯示 EmptyState 元件引導使用者建立報價單
   - 所有欄位為空

2. **Editing State (編輯狀態)**
   - 使用者正在輸入或修改報價單
   - 每次變更自動儲存至 localStorage（debounce 500ms）
   - 可新增、編輯、刪除項目

3. **Exporting State (匯出狀態)**
   - 使用者點擊「匯出 PDF」或「匯出 CSV」
   - 驗證資料完整性（至少一個項目）
   - 產生檔案並觸發下載

4. **Cleared State (已清除狀態)**
   - 匯出成功後立即清除 localStorage
   - 重設所有欄位為空
   - 顯示成功訊息（Toast 或 Alert）

---

## Validation Rules Summary

### Input Validation

| Field | Rule | Error Message (正體中文) |
|-------|------|-------------------------|
| Customer Name | 必填，1-100 字元 | 「請輸入客戶名稱」 |
| Customer Email | 選填，Email 格式 | 「Email 格式不正確」 |
| Item Description | 必填，1-200 字元 | 「請輸入品項名稱」 |
| Item Quantity | 必填，> 0 | 「數量必須大於零」 |
| Item Unit Price | 必填，> 0 | 「單價必須大於零」 |
| Items Array | 匯出時至少 1 項 | 「請至少新增一個報價項目」 |

### Export Validation

匯出前檢查：
1. ✅ 至少包含一個報價項目
2. ✅ 所有項目的 `quantity` 與 `unitPrice` > 0
3. ✅ 客戶名稱不為空

若驗證失敗，顯示錯誤訊息並阻止匯出。

---

## localStorage Schema

### Storage Key

```js
const STORAGE_KEY = 'quoteData'
```

### Stored Data Format

```json
{
  "customer": {
    "name": "ABC 公司",
    "email": "contact@abc.com",
    "phone": "0912345678"
  },
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "description": "網站設計",
      "quantity": 1,
      "unitPrice": 50000,
      "total": 50000
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "description": "LOGO 設計",
      "quantity": 2,
      "unitPrice": 8000,
      "total": 16000
    }
  ],
  "notes": "付款條件：簽約後 30 天內付清\n交付時程：專案啟動後 60 天完成",
  "createdAt": "2025-10-15T14:30:22.000Z"
}
```

### Error Handling

**Scenario 1: localStorage 資料損毀**
```js
try {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
  // 驗證資料結構
  if (!data.customer || !Array.isArray(data.items)) {
    throw new Error('Invalid data structure')
  }
} catch (error) {
  // 重設為空白狀態
  localStorage.removeItem(STORAGE_KEY)
  showMessage('資料格式異常，已重設為空白報價單')
}
```

**Scenario 2: localStorage 配額超限**
```js
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    showMessage('儲存空間不足，請清除瀏覽器資料後重試')
  }
}
```

---

## Data Flow Diagram

```
User Input
    ↓
Vue Component (v-model)
    ↓
Reactive State (ref/reactive)
    ↓
Watch (deep, debounced 500ms)
    ↓
localStorage.setItem()
    ↓
Persisted Data

---

Page Load
    ↓
localStorage.getItem()
    ↓
JSON.parse() + Validation
    ↓
Reactive State
    ↓
Vue Component (display)
    ↓
User sees restored data

---

Export Trigger
    ↓
Validation Check
    ↓ (Pass)
Generate PDF/CSV
    ↓
File Download
    ↓ (Success)
localStorage.removeItem()
    ↓
Reset State
    ↓
Empty State
```

---

## Implementation Notes

### 1. UUID Generation

使用簡單的 UUID v4 生成函式或引入 `uuid` 套件：

```js
// 簡單實作（適用於本專案）
function generateId() {
  return crypto.randomUUID() // 現代瀏覽器原生支援
}

// 或使用套件
import { v4 as uuidv4 } from 'uuid'
const id = uuidv4()
```

### 2. Date Formatting

使用 ISO 8601 格式儲存時間戳：

```js
const createdAt = new Date().toISOString()
// "2025-10-15T14:30:22.000Z"
```

顯示時轉換為本地時間：

```js
const displayDate = new Date(createdAt).toLocaleString('zh-TW')
// "2025/10/15 下午10:30:22"
```

### 3. Number Formatting

使用 `Intl.NumberFormat` 格式化金額：

```js
const formatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD',
  minimumFractionDigits: 0
})

formatter.format(50000) // "NT$50,000"
```

---

## Conclusion

資料模型設計完成，符合憲法規範與功能需求。所有欄位、驗證規則與狀態轉換皆已明確定義，可進入 quickstart 文件撰寫與後續實作階段。
