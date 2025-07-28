# ES Module Error Fix for Vercel Deployment

## Problem
Vercel was showing the error: `ReferenceError: require is not defined in ES module scope, you can use import instead`

## Root Cause
The main `package.json` has `"type": "module"` which makes all JavaScript files in the project use ES module syntax by default. However, Vercel serverless functions work better with CommonJS syntax.

## Solution Applied

### 1. Created `/api/package.json`
```json
{
  "type": "commonjs"
}
```
This overrides the ES module setting specifically for the `/api` directory and its subdirectories.

### 2. Ensured API files use CommonJS syntax
- `/api/elevenlabs/voices.js` - Uses `const axios = require('axios')` and `module.exports`
- `/api/elevenlabs/text-to-speech/[voiceId].js` - Uses `const axios = require('axios')` and `module.exports`

## Files Changed
1. **NEW**: `/api/package.json` - Forces CommonJS for API functions
2. **UPDATED**: `/api/elevenlabs/voices.js` - Confirmed CommonJS syntax
3. **UPDATED**: `/api/elevenlabs/text-to-speech/[voiceId].js` - Confirmed CommonJS syntax

## Next Steps
**Since Git is not available, please manually upload these files to GitHub:**

1. Go to your GitHub repository
2. Upload/update these files:
   - `api/package.json` (NEW FILE)
   - `api/elevenlabs/voices.js`
   - `api/elevenlabs/text-to-speech/[voiceId].js`
3. Commit with message: "Fix ES module error in Vercel API functions"

## Expected Result
After deployment, the "ReferenceError: require is not defined" error should be resolved and the voice functionality should work properly on Vercel.