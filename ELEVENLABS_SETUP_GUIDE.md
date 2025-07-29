# ElevenLabs API Setup Guide for Vercel

## Issue
The voice playback functionality fails because the `ELEVENLABS_API_KEY` environment variable is not configured in your Vercel deployment.

## Solution

### Step 1: Get Your ElevenLabs API Key
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for an account or log in
3. Navigate to your profile settings
4. Find the "API Key" section
5. Copy your API key

### Step 2: Add Environment Variable to Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (bedtime-story-beta)
3. Go to **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Click **Add New**
6. Set:
   - **Name**: `ELEVENLABS_API_KEY`
   - **Value**: Your ElevenLabs API key (paste it here)
   - **Environment**: Select all environments (Production, Preview, Development)
7. Click **Save**

### Step 3: Redeploy
After adding the environment variable:
1. Go to the **Deployments** tab in your Vercel project
2. Click **Redeploy** on the latest deployment
3. Wait for the deployment to complete

### Step 4: Test
1. Visit your deployed app
2. Create or open a story
3. Click the "Play Voice" button
4. The voice should now work!

## Alternative: Free Tier Limitations
If you don't want to use ElevenLabs API:
1. The app will still work without voice functionality
2. You can disable the voice features in the UI
3. Or implement a different text-to-speech solution

## Troubleshooting
- Make sure the API key is exactly as provided by ElevenLabs
- Ensure you've selected all environments when adding the variable
- Wait a few minutes after redeployment for changes to take effect
- Check the Vercel function logs for any error messages