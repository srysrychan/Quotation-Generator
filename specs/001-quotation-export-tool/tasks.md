# Tasks: 報價單匯出工具

**Input**: Design documents from `/specs/001-quotation-export-tool/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: 本專案依據憲法規定，不需要複雜的單元測試。採用手動測試與防禦性程式設計確保品質。

**Organization**: 任務依使用者故事（User Story）組織，每個故事可獨立實作與測試。

## Format: `[ID] [P?] [Story] Description`
- **[P]**: 可平行執行（不同檔案，無相依性）
- **[Story]**: 任務所屬的使用者故事（US1, US2, US3, US4）
- 包含確切的檔案路徑

## Path Conventions
- **專案類型**: Web 單頁應用程式（SPA）
- **根目錄**: `Quote-web/`
- **原始碼**: `src/`
- **公開資源**: `public/`

---

## Phase 1: Setup (專案初始化)

**Purpose**: 建立專案結構與安裝基礎相依性

- [x] T001 使用 Vite 建立 Vue 3 專案骨架
- [x] T002 安裝 Tailwind CSS v4 與相關工具（postcss, autoprefixer）
- [x] T003 [P] 設定 `tailwind.config.js` 與 `postcss.config.js`
- [x] T004 [P] 安裝功能相依性（html2pdf.js, papaparse, @heroicons/vue）
- [x] T005 建立專案目錄結構（src/components, src/utils, src/composables, public/assets）
- [x] T006 [P] 設定 `vite.config.js` 建置選項
- [x] T007 [P] 在 `src/style.css` 引入 Tailwind CSS 指令
- [x] T008 [P] 建立 `README.md` 專案說明文件（正體中文）

**Checkpoint**: 專案骨架完成，可執行 `npm run dev` 啟動開發伺服器

---

## Phase 2: Foundational (核心基礎建設)

**Purpose**: 建立所有使用者故事共用的核心功能

**⚠️ CRITICAL**: 此階段必須完成才能開始任何使用者故事實作

- [x] T009 實作 `src/composables/useLocalQuote.js` - localStorage 管理 composable
- [x] T010 [P] 實作 `src/utils/validation.js` - 輸入驗證工具函式
- [x] T011 [P] 建立空白報價單資料結構工廠函式於 `useLocalQuote.js`
- [x] T012 實作 localStorage 自動儲存機制（watch + debounce 500ms）
- [x] T013 實作 localStorage 載入與錯誤處理（資料損毀重設）
- [x] T014 [P] 準備公司 LOGO 圖片於 `public/assets/logo.png`

**Checkpoint**: 基礎設施就緒，使用者故事可開始平行開發

---

## Phase 3: User Story 1 - 建立並編輯報價單內容 (Priority: P1) 🎯 MVP

**Goal**: 使用者可輸入客戶資訊、新增/編輯/刪除報價項目、自動計算小計與總金額

**Independent Test**: 開啟網頁 → 輸入客戶資料 → 新增至少一個報價項目 → 確認小計自動計算 → 重新整理頁面 → 資料自動還原

### Implementation for User Story 1

- [x] T015 [P] [US1] 建立 `src/components/EmptyState.vue` - 空白狀態引導元件
- [x] T016 [P] [US1] 建立 `src/components/QuoteEditor.vue` - 客戶資訊編輯元件
- [x] T017 [P] [US1] 建立 `src/components/ItemTable.vue` - 報價項目表格元件
- [x] T018 [US1] 在 `QuoteEditor.vue` 實作客戶資訊表單（name, email, phone, notes）
- [x] T019 [US1] 在 `QuoteEditor.vue` 實作 v-model 雙向綁定至 quoteData.customer
- [x] T020 [US1] 在 `ItemTable.vue` 實作報價項目表格（description, quantity, unitPrice, total）
- [x] T021 [US1] 在 `ItemTable.vue` 實作「新增項目」按鈕與 addItem 函式
- [x] T022 [US1] 在 `ItemTable.vue` 實作「刪除項目」按鈕與 removeItem 函式
- [x] T023 [US1] 實作項目小計自動計算（quantity × unitPrice）
- [x] T024 [US1] 實作總金額計算（computed property）
- [x] T025 [US1] 在 `ItemTable.vue` 加入數量與單價驗證（必須 > 0）
- [x] T026 [US1] 顯示驗證錯誤訊息（正體中文）
- [x] T027 [US1] 在 `src/App.vue` 整合 EmptyState、QuoteEditor、ItemTable 元件
- [x] T028 [US1] 實作條件渲染（hasItems 時顯示編輯介面，否則顯示 EmptyState）
- [x] T029 [US1] 加入 Heroicons 圖示（PlusIcon, TrashIcon）
- [x] T030 [US1] 使用 Tailwind CSS 美化所有元件樣式

**Checkpoint**: 使用者可完整建立與編輯報價單，資料自動儲存至 localStorage

---

## Phase 4: User Story 2 - 匯出 PDF 格式報價單 (Priority: P1)

**Goal**: 使用者可將報價單匯出為專業樣式的 PDF 檔案，匯出後自動清除資料

**Independent Test**: 建立報價單 → 點擊「匯出 PDF」→ PDF 下載成功 → 開啟 PDF 確認內容正確且中文無亂碼 → 網頁內容已清空

### Implementation for User Story 2

- [x] T031 [P] [US2] 實作 `src/utils/exportPDF.js` - PDF 匯出工具函式
- [x] T032 [P] [US2] 建立 `src/components/ExportControls.vue` - 匯出按鈕元件
- [x] T033 [US2] 在 `App.vue` 建立隱藏的 PDF 預覽元件（id="pdf-preview"）
- [x] T034 [US2] 設計 PDF 樣式模板（公司資訊、LOGO、報價單標題、表格、備註）
- [x] T035 [US2] 在 PDF 模板中嵌入 Noto Sans TC 字型或使用系統字型
- [x] T036 [US2] 在 `exportPDF.js` 設定 html2pdf.js 選項（A4、直向、邊距）
- [x] T037 [US2] 實作 PDF 檔名生成（包含時間戳：quotation_YYYYMMDD_HHMMSS.pdf）
- [x] T038 [US2] 實作匯出前驗證（至少一個報價項目）
- [x] T039 [US2] 實作匯出失敗錯誤處理（保留 localStorage，顯示錯誤訊息）
- [x] T040 [US2] 在 `ExportControls.vue` 實作「匯出 PDF」按鈕與點擊處理
- [x] T041 [US2] 在 `App.vue` 實作 handleExportPDF 函式
- [x] T042 [US2] 匯出成功後呼叫 clearQuote() 清除 localStorage
- [x] T043 [US2] 匯出成功後顯示成功訊息（Toast 或 Alert）
- [x] T044 [US2] 匯出成功後重設畫面為空白狀態
- [x] T045 [US2] 在 `App.vue` 整合 ExportControls 元件
- [x] T046 [US2] 使用 Tailwind CSS 美化匯出按鈕樣式
- [x] T047 [US2] 加入 DocumentArrowDownIcon 圖示

**Checkpoint**: 使用者可成功匯出 PDF，中文正常顯示，匯出後資料自動清除

---

## Phase 5: User Story 3 - 匯出 CSV 格式報價單 (Priority: P2)

**Goal**: 使用者可將報價單匯出為 CSV 檔案，方便資料再利用

**Independent Test**: 建立報價單 → 點擊「匯出 CSV」→ CSV 下載成功 → 使用 Excel 開啟確認資料正確且中文正常 → 網頁內容已清空

### Implementation for User Story 3

- [x] T048 [P] [US3] 實作 `src/utils/exportCSV.js` - CSV 匯出工具函式
- [x] T049 [US3] 在 `exportCSV.js` 使用 papaparse 產生 CSV 字串
- [x] T050 [US3] 設定 CSV 欄位標題（品項名稱、數量、單價、小計）
- [x] T051 [US3] 將報價項目資料轉換為 CSV 格式
- [x] T052 [US3] 加入 UTF-8 BOM（\ufeff）確保 Excel 正確顯示中文
- [x] T053 [US3] 實作 CSV 檔名生成（包含時間戳：quotation_YYYYMMDD_HHMMSS.csv）
- [x] T054 [US3] 實作匯出前驗證（至少一個報價項目）
- [x] T055 [US3] 實作 Blob 下載觸發機制
- [x] T056 [US3] 在 `ExportControls.vue` 實作「匯出 CSV」按鈕與點擊處理
- [x] T057 [US3] 在 `App.vue` 實作 handleExportCSV 函式
- [x] T058 [US3] 匯出成功後呼叫 clearQuote() 清除 localStorage
- [x] T059 [US3] 匯出成功後顯示成功訊息
- [x] T060 [US3] 匯出成功後重設畫面為空白狀態
- [x] T061 [US3] 使用 Tailwind CSS 美化 CSV 匯出按鈕樣式
- [x] T062 [US3] 加入 TableCellsIcon 圖示

**Checkpoint**: 使用者可成功匯出 CSV，Excel 開啟正常顯示中文，匯出後資料自動清除

---

## Phase 6: User Story 4 - 響應式操作體驗 (Priority: P3)

**Goal**: 使用者可在手機、平板、桌面裝置上順暢操作報價單工具

**Independent Test**: 使用手機/平板開啟網頁 → 完成報價單建立與匯出流程 → 確認所有操作順暢且介面元素適當調整

### Implementation for User Story 4

- [x] T063 [P] [US4] 在 `QuoteEditor.vue` 加入響應式樣式（sm:, md:, lg: 前綴）
- [x] T064 [P] [US4] 在 `ItemTable.vue` 加入響應式表格樣式（小螢幕使用卡片式版面）
- [x] T065 [P] [US4] 在 `ExportControls.vue` 加入響應式按鈕樣式
- [x] T066 [P] [US4] 在 `EmptyState.vue` 加入響應式文字與圖示尺寸
- [x] T067 [US4] 在 `App.vue` 加入響應式容器樣式（max-w-4xl, px-4）
- [x] T068 [US4] 確保所有按鈕最小點擊區域為 44x44px（觸控友善）
- [x] T069 [US4] 確保所有輸入欄位在手機上易於點擊與輸入
- [x] T070 [US4] 測試手機螢幕（375px）顯示效果
- [x] T071 [US4] 測試平板螢幕（768px）顯示效果
- [x] T072 [US4] 測試桌面螢幕（1920px）顯示效果
- [x] T073 [US4] 調整表格在小螢幕的橫向捲動或卡片式版面
- [x] T074 [US4] 確保 PDF 在手機上可正常下載與開啟

**Checkpoint**: 所有裝置尺寸皆可順暢操作，介面元素適當調整

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 最終優化與跨功能改善

- [x] T075 [P] 在所有元件加入適當的 aria-label 提升無障礙性
- [x] T076 [P] 檢查所有錯誤訊息使用正體中文
- [x] T077 [P] 檢查所有使用者介面文字使用正體中文
- [x] T078 [P] 檢查所有程式碼命名與註解使用英文
- [x] T079 程式碼重構：移除重複程式碼，確保 DRY 原則
- [x] T080 [P] 效能最佳化：檢查無不必要的重新渲染
- [x] T081 [P] 加入適當的 loading 狀態（匯出 PDF 時）
- [x] T082 [P] 改善錯誤訊息顯示方式（Toast 通知取代 Alert）
- [x] T083 執行 quickstart.md 中的完整測試檢查清單
- [x] T084 [P] 更新 README.md 包含安裝、執行、部署指引
- [x] T085 [P] 建立 `.gitignore` 排除 node_modules 與 dist
- [x] T086 建置生產版本（npm run build）並測試
- [x] T087 [P] 準備部署至 Netlify 或 Vercel 的設定檔

**Checkpoint**: 專案完成，可部署至生產環境

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無相依性 - 可立即開始
- **Foundational (Phase 2)**: 相依於 Setup 完成 - 阻擋所有使用者故事
- **User Stories (Phase 3-6)**: 全部相依於 Foundational 完成
  - 使用者故事可平行開發（若有多人團隊）
  - 或依優先級順序開發（P1 → P1 → P2 → P3）
- **Polish (Phase 7)**: 相依於所有期望的使用者故事完成

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 完成後即可開始 - 無其他故事相依性 ✅ 獨立
- **User Story 2 (P1)**: Foundational 完成後即可開始 - 需要 US1 的資料結構但可獨立測試 ⚠️ 建議 US1 完成後開始
- **User Story 3 (P2)**: Foundational 完成後即可開始 - 需要 US1 的資料結構但可獨立測試 ⚠️ 建議 US1 完成後開始
- **User Story 4 (P3)**: Foundational 完成後即可開始 - 為現有元件加入響應式樣式 ⚠️ 建議所有 UI 元件完成後開始

### Within Each User Story

- 元件建立（[P] 標記的任務可平行）
- 元件邏輯實作（依序執行）
- 整合至 App.vue
- 樣式美化
- 故事完成後再進入下一優先級

### Parallel Opportunities

- **Phase 1**: T003, T004, T006, T007, T008 可平行執行
- **Phase 2**: T010, T011, T014 可平行執行
- **Phase 3**: T015, T016, T017 可平行執行（不同檔案）
- **Phase 4**: T031, T032 可平行執行（不同檔案）
- **Phase 5**: T048 可獨立執行
- **Phase 6**: T063, T064, T065, T066 可平行執行（不同檔案）
- **Phase 7**: 大部分任務可平行執行

---

## Parallel Example: User Story 1

```bash
# 平行建立所有元件骨架（不同檔案）:
Task T015: "建立 src/components/EmptyState.vue"
Task T016: "建立 src/components/QuoteEditor.vue"
Task T017: "建立 src/components/ItemTable.vue"

# 完成後依序實作邏輯:
Task T018: "在 QuoteEditor.vue 實作客戶資訊表單"
Task T019: "在 QuoteEditor.vue 實作 v-model 雙向綁定"
# ... 依序執行
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational (CRITICAL - 阻擋所有故事)
3. ✅ Complete Phase 3: User Story 1（建立與編輯）
4. ✅ Complete Phase 4: User Story 2（匯出 PDF）
5. **STOP and VALIDATE**: 獨立測試 US1 + US2
6. 部署/展示 MVP

**MVP 範圍**: 使用者可建立報價單並匯出 PDF，這是最核心的價值。

### Incremental Delivery

1. Setup + Foundational → 基礎就緒
2. Add User Story 1 → 獨立測試 → 可展示編輯功能
3. Add User Story 2 → 獨立測試 → 部署/展示（MVP！）
4. Add User Story 3 → 獨立測試 → 部署/展示（增加 CSV 匯出）
5. Add User Story 4 → 獨立測試 → 部署/展示（完整響應式支援）
6. Polish → 最終優化 → 正式發布

每個故事增加價值而不破壞先前故事。

### Parallel Team Strategy

若有多位開發者：

1. 團隊一起完成 Setup + Foundational
2. Foundational 完成後：
   - 開發者 A: User Story 1（建立與編輯）
   - 開發者 B: User Story 2（PDF 匯出）- 需等待 US1 資料結構
   - 開發者 C: User Story 3（CSV 匯出）- 需等待 US1 資料結構
3. US1 完成後，US2 與 US3 可平行整合
4. 開發者 D: User Story 4（響應式）- 需等待所有 UI 元件完成

**建議**: 單人開發依優先級順序執行（US1 → US2 → US3 → US4）

---

## Task Summary

- **Total Tasks**: 87
- **Setup Phase**: 8 tasks
- **Foundational Phase**: 6 tasks
- **User Story 1 (P1)**: 16 tasks
- **User Story 2 (P1)**: 17 tasks
- **User Story 3 (P2)**: 15 tasks
- **User Story 4 (P3)**: 12 tasks
- **Polish Phase**: 13 tasks

### Tasks per User Story

| Story | Priority | Task Count | Independent Test |
|-------|----------|------------|------------------|
| US1 | P1 | 16 | ✅ 可獨立測試編輯功能 |
| US2 | P1 | 17 | ✅ 可獨立測試 PDF 匯出 |
| US3 | P2 | 15 | ✅ 可獨立測試 CSV 匯出 |
| US4 | P3 | 12 | ✅ 可獨立測試響應式 |

### Parallel Opportunities Identified

- **25 tasks** 標記為 [P]，可平行執行
- **4 user stories** 在 Foundational 完成後可平行開發（若有團隊）
- **建議 MVP 範圍**: Phase 1 + 2 + 3 + 4（US1 + US2）= 47 tasks

---

## Notes

- [P] 任務 = 不同檔案，無相依性，可平行執行
- [Story] 標籤將任務對應至特定使用者故事，便於追蹤
- 每個使用者故事應可獨立完成與測試
- 在每個 Checkpoint 停下來驗證故事獨立運作
- 避免：模糊任務、同檔案衝突、破壞獨立性的跨故事相依
- 遵循憲法：JavaScript ES6、Vue 3 Composition API、Tailwind CSS v4、正體中文 UI、英文程式碼
- 每完成一個任務或邏輯群組即 commit

---

## Format Validation

✅ 所有任務遵循檢查清單格式：
- ✅ 以 `- [ ]` 開頭（markdown checkbox）
- ✅ 包含任務 ID（T001-T087）
- ✅ 適當標記 [P]（可平行）
- ✅ 使用者故事任務標記 [Story]（US1-US4）
- ✅ 包含明確的檔案路徑或描述
- ✅ 使用正體中文描述（符合憲法）
