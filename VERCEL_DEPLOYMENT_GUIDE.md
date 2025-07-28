# Vercel 部署指南 / Vercel Deployment Guide

## 問題描述 / Problem Description

如果您在 Vercel 部署後看到語音功能出現錯誤訊息「語音生成失敗」，這是因為缺少 ElevenLabs API 金鑰的環境變數設定。

If you see voice generation errors after deploying to Vercel, it's because the ElevenLabs API key environment variable is missing.

## 解決方案 / Solution

### 步驟 1: 獲取 ElevenLabs API 金鑰 / Step 1: Get ElevenLabs API Key

1. 前往 [ElevenLabs](https://elevenlabs.io/) 註冊帳號
2. 登入後前往 Profile Settings
3. 複製您的 API Key

### 步驟 2: 在 Vercel 中設定環境變數 / Step 2: Set Environment Variables in Vercel

1. 登入您的 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的專案 (Bedtime-Story-Beta)
3. 點擊 "Settings" 標籤
4. 在左側選單中點擊 "Environment Variables"
5. 點擊 "Add New" 按鈕
6. 設定以下環境變數：
   - **Name**: `ELEVENLABS_API_KEY`
   - **Value**: 您的 ElevenLabs API 金鑰
   - **Environment**: 選擇 "Production", "Preview", 和 "Development"
7. 點擊 "Save"

### 步驟 3: 重新部署 / Step 3: Redeploy

1. 在 Vercel Dashboard 中，前往 "Deployments" 標籤
2. 點擊最新部署旁的三個點選單
3. 選擇 "Redeploy"
4. 或者，推送新的 commit 到您的 Git 儲存庫以觸發自動部署

## 驗證部署 / Verify Deployment

部署完成後：
1. 前往您的 Vercel 應用程式 URL
2. 進入語音設定頁面
3. 嘗試播放語音預覽
4. 如果仍有問題，檢查瀏覽器開發者工具的 Console 標籤查看詳細錯誤訊息

## 故障排除 / Troubleshooting

### 常見問題 / Common Issues

1. **API 金鑰無效**: 確認您複製了正確的 API 金鑰
2. **環境變數未生效**: 確保在設定環境變數後重新部署
3. **API 配額用盡**: 檢查您的 ElevenLabs 帳戶配額

### 檢查 API 端點 / Check API Endpoints

您可以直接訪問以下 URL 來測試 API 端點：
- `https://your-app.vercel.app/api/elevenlabs/voices` - 應該返回可用語音列表

如果返回錯誤，請檢查：
1. 環境變數是否正確設定
2. API 金鑰是否有效
3. ElevenLabs 服務是否正常運行

## 本地開發 / Local Development

如果您想在本地測試：
1. 複製 `.env.example` 為 `.env`
2. 在 `.env` 中設定您的 `ELEVENLABS_API_KEY`
3. 重新啟動開發伺服器

```bash
cp .env.example .env
# 編輯 .env 檔案，添加您的 API 金鑰
npm run dev
```

## 支援 / Support

如果您仍然遇到問題，請檢查：
- [ElevenLabs API 文檔](https://docs.elevenlabs.io/)
- [Vercel 環境變數文檔](https://vercel.com/docs/concepts/projects/environment-variables)