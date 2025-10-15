# Quote-web 報價單匯出工具

一個純前端的報價單建立與匯出工具，專為個人創作者、SOHO 接案者與中小型企業業務設計。

## 功能特色

- ✅ **快速建立報價單**：輸入客戶資訊與報價項目，自動計算總金額
- ✅ **匯出 PDF**：產生專業樣式的 PDF 報價單，支援中文字型
- ✅ **匯出 CSV**：匯出報價項目資料，方便後續處理
- ✅ **自動儲存**：所有資料自動儲存至瀏覽器 localStorage
- ✅ **隱私優先**：無需登入，無後端伺服器，資料完全本地化
- ✅ **響應式設計**：支援手機、平板、桌面裝置

## 技術棧

- **前端框架**：Vue 3 (Composition API)
- **樣式系統**：Tailwind CSS v4
- **建置工具**：Vite
- **PDF 匯出**：html2pdf.js
- **CSV 匯出**：papaparse
- **圖示庫**：@heroicons/vue

## 安裝與執行

### 安裝相依性

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

開啟瀏覽器訪問 `http://localhost:5173`

### 建置生產版本

```bash
npm run build
```

建置完成後，`dist/` 目錄即為靜態檔案，可部署至任何靜態網站託管服務。

### 預覽生產版本

```bash
npm run preview
```

## 使用說明

1. **建立報價單**：輸入客戶名稱、聯絡資訊與備註
2. **新增項目**：點擊「新增項目」按鈕，填寫品項名稱、數量與單價
3. **自動計算**：小計與總金額自動計算並即時更新
4. **匯出檔案**：
   - 點擊「匯出 PDF」產生 PDF 檔案
   - 點擊「匯出 CSV」產生 CSV 檔案
5. **資料清除**：匯出成功後，資料自動清除

## 專案結構

```
Quote-web/
├── src/
│   ├── components/       # Vue 元件
│   ├── utils/           # 工具函式
│   ├── composables/     # Composition API hooks
│   ├── App.vue          # 主應用程式
│   ├── main.js          # 進入點
│   └── style.css        # 全域樣式
├── public/
│   └── assets/          # 靜態資源
├── specs/               # 功能規格文件
└── package.json
```

## 授權

MIT License

## 聯絡方式

如有問題或建議，歡迎開 Issue 討論。
