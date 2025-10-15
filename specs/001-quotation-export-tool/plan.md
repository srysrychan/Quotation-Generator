# Implementation Plan: 報價單匯出工具

**Branch**: `001-quotation-export-tool` | **Date**: 2025-10-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-quotation-export-tool/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

本功能為離線型報價單建立與匯出工具，使用者可快速建立報價單、編輯客戶資訊與報價項目、即時儲存於 localStorage、並匯出為 PDF 或 CSV 格式。匯出完成後自動清除所有資料，確保無歷史紀錄殘留。

**技術方案**：採用 Vue 3 Composition API + Tailwind CSS v4 建立單頁應用程式（SPA），使用 html2pdf.js 與 papaparse 處理檔案匯出，所有資料暫存於瀏覽器 localStorage，無需後端伺服器。

## Technical Context

**Language/Version**: JavaScript ES6（嚴格禁止 TypeScript）  
**Primary Dependencies**: 
- Vue 3（Composition API only）
- Tailwind CSS v4
- html2pdf.js（PDF 匯出）
- papaparse（CSV 匯出）
- @heroicons/vue（圖示）

**Storage**: localStorage（瀏覽器本地儲存，無後端資料庫）  
**Testing**: 手動測試與防禦性程式設計（憲法規定：不需要複雜的單元測試）  
**Target Platform**: 現代瀏覽器（Chrome、Firefox、Safari、Edge），支援響應式設計（手機、平板、桌面）  
**Project Type**: Web 單頁應用程式（SPA）  
**Performance Goals**: 
- localStorage 儲存延遲 < 500ms
- 支援至少 20 個報價項目無 UI 凍結
- PDF 匯出時間 < 5 秒（一般報價單）

**Constraints**: 
- 離線優先：無網路連線需求
- 匯出後立即清除 localStorage
- 正體中文字型支援（PDF 無亂碼）
- 響應式設計：最小支援螢幕寬度 375px

**Scale/Scope**: 
- 單一使用者、單一報價單
- 預期報價項目數量：1-20 項
- 無多使用者協作需求
- 無歷史紀錄功能

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ 技術棧規範檢查

- ✅ **程式語言**: JavaScript ES6（符合憲法，禁止 TypeScript）
- ✅ **前端框架**: Vue 3 Composition API（符合憲法，禁止 Options API）
- ✅ **樣式系統**: Tailwind CSS v4（符合憲法）
- ✅ **圖示資源**: Heroicons（符合憲法，禁止 emoji）
- ✅ **PDF 匯出**: html2pdf.js（符合憲法指定工具）
- ✅ **CSV 匯出**: papaparse（符合憲法指定工具）
- ✅ **禁止後端**: 無後端儲存與登入機制（符合憲法）

### ✅ 使用者體驗卓越性檢查

- ✅ **編輯體驗**: 所有欄位可直接編輯
- ✅ **即時儲存**: 自動儲存至 localStorage
- ✅ **響應式設計**: 支援手機、平板、桌面
- ✅ **匯出即清除**: 匯出成功後清除 localStorage
- ✅ **錯誤防呆**: 匯出失敗時保留資料
- ✅ **空白狀態**: 初次使用顯示引導畫面
- ✅ **效能標準**: 無不必要的重新渲染、無 UI 凍結

### ✅ 程式碼品質與可維護性檢查

- ✅ **最佳化**: 使用 Vue 3 Composition API 最佳實踐
- ✅ **可讀性**: 元件與函式命名清晰
- ✅ **模組化**: 元件、工具函式、composables 分離
- ✅ **DRY 原則**: 避免程式碼重複
- ✅ **一致性**: 統一命名與風格規範

### ✅ 資料處理與匯出規範檢查

- ✅ **資料暫存**: 僅使用 localStorage
- ✅ **自動更新**: 每次變更自動儲存
- ✅ **匯出清除**: PDF/CSV 匯出後清除 localStorage
- ✅ **資料結構**: 符合憲法定義的 JSON 格式
- ✅ **PDF 規範**: 使用 html2pdf.js，支援中文字型
- ✅ **CSV 規範**: 使用 papaparse，包含欄位標題
- ✅ **錯誤處理**: 匯出失敗不清除資料

### ✅ 命名規範與文件標準檢查

- ✅ **元件命名**: PascalCase（QuoteEditor.vue）
- ✅ **函式命名**: camelCase（handleExportPDF）
- ✅ **程式碼語言**: 英文命名與註解
- ✅ **UI 語言**: 正體中文介面文字
- ✅ **文件語言**: README 使用正體中文

### ✅ 專案結構規範檢查

- ✅ **目錄結構**: 符合憲法建議結構
  - `src/components/` - Vue 元件
  - `src/utils/` - 工具函式
  - `src/composables/` - Vue Composition API hooks
  - `src/App.vue` - 主應用程式
  - `src/main.js` - 進入點

**憲法檢查結果**: ✅ 全部通過，無違反項目

## Project Structure

### Documentation (this feature)

```
specs/001-quotation-export-tool/
├── spec.md              # 功能規格（已完成）
├── plan.md              # 本文件（實作計畫）
├── research.md          # Phase 0 研究文件（待產生）
├── data-model.md        # Phase 1 資料模型（待產生）
├── quickstart.md        # Phase 1 快速開始指南（待產生）
├── contracts/           # Phase 1 API 合約（本專案無 API，可省略）
├── tasks.md             # Phase 2 任務清單（/speckit.tasks 產生）
└── checklists/
    └── requirements.md  # 規格品質檢查清單（已完成）
```

### Source Code (repository root)

```
Quote-web/
├── src/
│   ├── components/
│   │   ├── QuoteEditor.vue      # 客戶資訊與備註編輯元件
│   │   ├── ItemTable.vue        # 報價項目表格元件
│   │   ├── ExportControls.vue   # 匯出按鈕控制元件
│   │   └── EmptyState.vue       # 空白狀態引導元件
│   ├── utils/
│   │   ├── exportPDF.js         # PDF 匯出工具函式
│   │   ├── exportCSV.js         # CSV 匯出工具函式
│   │   └── validation.js        # 輸入驗證工具函式
│   ├── composables/
│   │   └── useLocalQuote.js     # localStorage 管理 composable
│   ├── App.vue                  # 主應用程式元件
│   └── main.js                  # Vue 應用程式進入點
├── public/
│   ├── index.html               # HTML 模板
│   └── assets/
│       └── logo.png             # 公司 LOGO（用於 PDF）
├── package.json                 # 專案相依性
├── vite.config.js               # Vite 建置設定
├── tailwind.config.js           # Tailwind CSS 設定
├── postcss.config.js            # PostCSS 設定
└── README.md                    # 專案說明文件（正體中文）
```

**Structure Decision**: 

採用 **Web 單頁應用程式（SPA）** 結構，因為：
1. 本專案為純前端應用，無後端需求
2. 所有資料處理在瀏覽器端完成
3. 使用 Vite 作為建置工具（Vue 3 官方推薦）
4. 元件化設計，符合 Vue 3 Composition API 最佳實踐
5. 工具函式與 composables 分離，提升可維護性

**關鍵目錄說明**：
- `src/components/` - 可重複使用的 Vue 元件
- `src/utils/` - 純函式工具（匯出、驗證）
- `src/composables/` - Vue Composition API hooks（狀態管理）
- `public/assets/` - 靜態資源（LOGO 用於 PDF 匯出）

## Complexity Tracking

*本專案無憲法違反項目，此章節為空*

本實作計畫完全符合憲法所有規範，無需額外說明或例外處理。

---

## Phase 0: Research (✅ Complete)

**Status**: ✅ Complete  
**Output**: [research.md](./research.md)

已完成所有技術選型研究，包括：
- Vue 3 Composition API 最佳實踐
- Tailwind CSS v4 設定與使用
- html2pdf.js 與 papaparse 整合方式
- localStorage 資料管理策略
- 響應式設計與瀏覽器相容性
- 效能最佳化策略

所有技術決策皆符合憲法規範，無需澄清項目。

---

## Phase 1: Design & Contracts (✅ Complete)

**Status**: ✅ Complete  
**Outputs**: 
- [data-model.md](./data-model.md) - 資料模型定義
- [quickstart.md](./quickstart.md) - 快速開始指南

### 資料模型

已定義三個核心實體：
1. **Quotation** - 完整報價單物件
2. **Customer** - 客戶資訊
3. **QuotationItem** - 報價項目

包含完整的驗證規則、狀態轉換與錯誤處理策略。

### 快速開始指南

提供完整的專案設定、安裝步驟、核心實作指引與測試檢查清單。開發者可依照此文件快速建立專案骨架。

### API 合約

本專案為純前端應用，無 API 端點，因此無需建立 `contracts/` 目錄。

---

## Constitution Check (Post-Design)

**Re-validation Status**: ✅ Pass

Phase 1 設計完成後重新驗證憲法合規性：

- ✅ 資料模型使用憲法定義的 JSON 格式
- ✅ 所有元件命名使用 PascalCase（QuoteEditor.vue）
- ✅ 所有函式命名使用 camelCase（useLocalQuote）
- ✅ 使用者介面文字使用正體中文
- ✅ 錯誤訊息使用正體中文
- ✅ 程式碼註解使用英文
- ✅ localStorage 為唯一儲存方式
- ✅ 匯出後清除 localStorage
- ✅ 無後端相依性

**結論**: 設計階段完全符合憲法規範，可進入 Phase 2 任務生成階段。

---

## Next Steps

執行 `/speckit.tasks` 產生詳細的實作任務清單（tasks.md），然後使用 `/speckit.implement` 開始系統化實作。
