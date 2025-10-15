# 📄 報價單工具 | Quotation Generator

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Vue](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)

一個現代化的純前端報價單建立與匯出工具，專為個人創作者、SOHO 接案者與中小型企業設計。

[線上展示](#) | [功能特色](#功能特色) | [快速開始](#快速開始) | [使用說明](#使用說明)

</div>

---

## ✨ 功能特色

### 📝 完整的報價單資訊
- **報價單編號** - 自動生成唯一編號（格式：Q-YYYYMMDD-XXXX）
- **有效期限** - 預設 30 天，可自訂調整
- **公司資訊** - 報價方的完整資訊（名稱、地址、電話、Email）
- **客戶資訊** - 受報價方的完整資訊（名稱、地址、電話、Email）
- **報價項目** - 品項名稱、數量、單價、自動計算小計
- **備註欄位** - 付款條件、交付時程等額外資訊

### 🎨 現代化設計
- **Notion 風格** - 簡潔優雅的現代化介面
- **響應式設計** - 完美支援手機、平板、桌面裝置
- **即時預覽** - 所見即所得的編輯體驗
- **流暢動畫** - 細膩的互動回饋

### 📤 多格式匯出
- **PDF 匯出** - 專業樣式的 PDF 報價單，支援正體中文
- **CSV 匯出** - 報價項目資料，方便後續處理與分析
- **自動清除** - 匯出成功後自動清除資料，保護隱私

### 🔒 隱私優先
- **無需登入** - 開啟即用，無需註冊帳號
- **本地儲存** - 所有資料僅存於瀏覽器 localStorage
- **無後端** - 純前端應用，資料不會上傳至任何伺服器
- **自動儲存** - 編輯時自動儲存，防止資料遺失

---

## 🛠️ 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **Vue 3** | 3.5.22 | 前端框架（Composition API） |
| **Tailwind CSS** | 3.4.17 | 樣式系統 |
| **Vite** | 7.1.7 | 建置工具 |
| **jsPDF** | Latest | PDF 生成 |
| **html2canvas** | Latest | HTML 轉圖片 |
| **papaparse** | 5.5.3 | CSV 處理 |
| **Heroicons** | 2.2.0 | 圖示庫 |

---

## 🚀 快速開始

### 前置需求

- Node.js 16.0 或更高版本
- npm 或 yarn 套件管理工具

### 安裝步驟

1. **Clone 專案**

```bash
git clone https://github.com/zz41354899/Quote-web.git
cd Quote-web
```

2. **安裝相依性**

```bash
npm install
```

3. **啟動開發伺服器**

```bash
npm run dev
```

4. **開啟瀏覽器**

訪問 `http://localhost:5173` 即可開始使用

### 建置與部署

**建置生產版本**

```bash
npm run build
```

建置完成後，`dist/` 目錄包含所有靜態檔案，可部署至：
- Vercel
- Netlify
- GitHub Pages
- 任何靜態網站託管服務

**預覽生產版本**

```bash
npm run preview
```

---

## 📖 使用說明

### 基本流程

1. **填寫報價單資訊**
   - 報價單編號（自動生成）
   - 有效期限（預設 30 天）

2. **填寫公司資訊**（報價方）
   - 公司名稱
   - 公司地址
   - 公司電話
   - 公司 Email

3. **填寫客戶資訊**（受報價方）
   - 客戶名稱 ⭐ 必填
   - 客戶地址
   - 聯絡電話
   - Email

4. **新增報價項目**
   - 點擊「新增項目」按鈕
   - 填寫品項名稱、數量、單價
   - 系統自動計算小計與總金額

5. **填寫備註**（選填）
   - 付款條件
   - 交付時程
   - 其他說明

6. **匯出報價單**
   - **匯出 PDF** - 產生專業的 PDF 報價單
   - **匯出 CSV** - 匯出報價項目資料表
   - 匯出成功後，所有資料自動清除

### 資料管理

- ✅ **自動儲存** - 編輯時自動儲存至 localStorage
- ✅ **重新載入** - 重新整理頁面後資料自動還原
- ✅ **自動清除** - 匯出成功後資料自動清除
- ✅ **錯誤保護** - 匯出失敗時資料保留

---

## 📸 功能截圖

### 主介面
> 現代化的 Notion 風格設計

### PDF 報價單
> 專業的 PDF 輸出格式

### 響應式設計
> 完美支援各種裝置尺寸

---

## 📁 專案結構

```
Quote-web/
├── src/
│   ├── components/          # Vue 元件
│   │   ├── EmptyState.vue   # 空白狀態頁面
│   │   ├── QuoteEditor.vue  # 報價單編輯器
│   │   ├── ItemTable.vue    # 報價項目表格
│   │   └── ExportControls.vue # 匯出控制按鈕
│   ├── composables/         # Composition API
│   │   └── useLocalQuote.js # localStorage 管理
│   ├── utils/              # 工具函式
│   │   ├── exportPDF.js    # PDF 匯出
│   │   ├── exportCSV.js    # CSV 匯出
│   │   └── validation.js   # 資料驗證
│   ├── App.vue             # 主應用程式
│   ├── main.js             # 進入點
│   └── style.css           # 全域樣式
├── specs/                  # 功能規格文件
│   └── 001-quotation-export-tool/
│       ├── spec.md         # 功能規格
│       ├── plan.md         # 技術計畫
│       ├── tasks.md        # 任務清單
│       └── data-model.md   # 資料模型
├── .specify/               # 專案憲法與模板
│   └── memory/
│       └── constitution.md # 專案憲法
├── public/                 # 靜態資源
├── package.json            # 專案設定
├── vite.config.js          # Vite 設定
├── tailwind.config.js      # Tailwind 設定
└── README.md               # 專案說明
```

---

## 🎯 開發原則

本專案遵循**規格驅動開發（SSD）**工作流程：

1. **規格制定** - 定義功能需求與使用者情境
2. **技術規劃** - 設計架構與技術方案
3. **任務分解** - 拆解為可執行的開發任務
4. **系統化實作** - 按計畫執行開發

### 技術限制

- ✅ 使用 JavaScript ES6（禁止 TypeScript）
- ✅ 使用 Vue 3 Composition API（禁止 Options API）
- ✅ 使用 Tailwind CSS
- ✅ 使用 Heroicons（禁止 emoji）
- ✅ 無後端儲存與登入機制
- ✅ 所有資料暫存於 localStorage
- ✅ 匯出後立即清除資料

---

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 提交 Issue

- 🐛 Bug 回報
- 💡 功能建議
- 📝 文件改進
- ❓ 使用問題

### Pull Request

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📝 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

---

## 👨‍💻 作者

**zz41354899**

- GitHub: [@zz41354899](https://github.com/zz41354899)
- 專案連結: [Quote-web](https://github.com/zz41354899/Quote-web)

---

## 🙏 致謝

- [Vue.js](https://vuejs.org/) - 漸進式 JavaScript 框架
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS 框架
- [Vite](https://vitejs.dev/) - 下一代前端建置工具
- [jsPDF](https://github.com/parallax/jsPDF) - PDF 生成庫
- [html2canvas](https://html2canvas.hertzen.com/) - HTML 轉圖片
- [papaparse](https://www.papaparse.com/) - CSV 解析庫
- [Heroicons](https://heroicons.com/) - 精美的 SVG 圖示

---

## 📮 聯絡方式

如有問題或建議，歡迎：
- 開啟 [Issue](https://github.com/zz41354899/Quote-web/issues)
- 提交 [Pull Request](https://github.com/zz41354899/Quote-web/pulls)

---

<div align="center">

**⭐ 如果這個專案對您有幫助，請給個星星支持！**

Made with ❤️ by zz41354899

</div>
