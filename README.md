# Hifdh App

A mobile application for Quran memorization (Hifdh) competition preparation, built with React Native and Expo.

## 🚀 Getting Started

### Prerequisites

- Node.js (v17+)
- npm or yarn
- Expo CLI (using npx - no global installation needed)
- iOS Simulator (macOS only) or Android Emulator or physical device with Expo Go

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd hifdh-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env` and update with your Supabase credentials
   - Get Supabase credentials from: https://supabase.com

4. **Download Arabic Font:**
   - Download Noto Naskh Arabic Regular from Google Fonts
   - Place `NotoNaskhArabic-Regular.ttf` in `assets/fonts/`
   - Link: https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic

### Running the App

```bash
# Start Expo development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS (macOS only)
npx expo start --ios

# Run on web
npx expo start --web
```

