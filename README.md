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

## 📁 Project Structure

```
hifdh-app/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (app)/             # Main app screens
│   │   ├── index.tsx      # Category selection
│   │   ├── configure.tsx  # Session configuration
│   │   ├── trial.tsx      # Trial screen
│   │   ├── summary.tsx    # Session summary
│   │   ├── history.tsx    # Session history
│   │   ├── statistics.tsx # Performance statistics
│   │   ├── settings.tsx   # Settings
│   │   └── offline.tsx    # Offline downloads
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── src/
│   ├── components/        # Reusable components
│   ├── services/          # Business logic & data
│   │   ├── quranData.ts   # Quran metadata
│   │   └── juzData.ts     # Juz boundaries
│   ├── stores/            # Zustand state management
│   ├── utils/             # Utility functions
│   ├── lib/               # Third-party configs
│   │   └── supabase.ts    # Supabase client
│   ├── types.ts           # TypeScript types
│   └── constants.ts       # App constants
├── assets/
│   └── fonts/             # Custom fonts
├── .env                   # Environment variables
├── tailwind.config.js     # Tailwind CSS config
├── metro.config.js        # Metro bundler config
└── app.json               # Expo configuration
```

## 🛠️ Tech Stack

### Frontend
- **React Native 0.81** - Mobile framework
- **Expo SDK 54** - Development platform
- **TypeScript 5.9** - Type safety
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind CSS for React Native
- **Zustand** - State management

### Backend & Services
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage

### Local Storage
- **AsyncStorage** - Key-value storage
- **Expo SQLite** - Local database
- **Expo FileSystem** - File caching

### Media
- **expo-av** - Audio playback
- **expo-font** - Custom fonts

## 📋 Implementation Status

### ✅ Phase 1: Foundation (Completed)
- [x] Create Expo project with TypeScript
- [x] Install core dependencies
- [x] Configure NativeWind and Tailwind CSS
- [x] Set up Expo Router navigation
- [x] Create project directory structure
- [x] Migrate shared code (types, constants, data)
- [x] Configure Supabase client

### ⏳ Phase 1: Remaining Tasks
- [ ] Download and install Arabic font
- [ ] Create Supabase project and run database schema
- [ ] Test basic navigation flow

### 🔜 Next Phases
- **Phase 2**: Core Services (storage, database, audio, cache)
- **Phase 3**: State Management with Zustand
- **Phase 4**: UI Component Migration
- **Phase 5**: Session History & Statistics
- **Phase 6**: Settings & Offline Features
- **Phase 7-10**: Advanced Features & Polish

## 🎯 Key Features (Planned)

### Core Features
- ✅ Category-based practice (Last 5/10/15 Juz, Full Quran)
- ✅ Random trial generation
- ✅ Audio playback (multiple reciters)
- ✅ Session scoring and notes
- ✅ Session history and export

### Advanced Features
- 📱 User authentication and cloud sync
- 📊 Performance statistics and analytics
- 💾 Offline mode with local caching
- 🔄 Spaced repetition system (SRS)
- ✍️ Verse input and verification mode
- 🎚️ Variable difficulty levels
- 🎙️ Audio recording (future)
- 🤖 AI-powered tips with Gemini (future)

## 🔧 Configuration

### NativeWind Setup
The project uses NativeWind v4 for styling. Configuration is in:
- `tailwind.config.js` - Tailwind configuration
- `metro.config.js` - Metro bundler setup
- `babel.config.js` - Babel transform
- `global.css` - Tailwind directives

### Expo Router Setup
File-based routing is configured in `app.json`:
- Typed routes enabled
- Deep linking configured with `hifdh-app://` scheme
- Automatic screen generation from file structure

### Theme Support
- Supports light and dark modes
- Uses system preference by default
- Tailwind dark mode classes (e.g., `dark:bg-gray-900`)

## 🗄️ Database Schema

The Supabase database schema includes:
- **profiles** - User profiles
- **sessions** - Practice sessions
- **trial_results** - Individual trial results
- **user_preferences** - User settings
- **offline_downloads** - Downloaded content tracking
- **user_statistics** - Performance metrics

See the implementation plan for full SQL schema.

## 🌐 External APIs

- **AlQuran Cloud API** - Quran text (https://alquran.cloud/api)
- **Islamic Network CDN** - Audio recitations
- **Google Gemini API** - AI features (optional)

## 📱 Development

### Running Tests
```bash
# Unit tests (when implemented)
npm test

# E2E tests (when implemented)
npm run test:e2e
```

### Building for Production
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# All platforms
eas build --platform all
```

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier (configure as needed)
- NativeWind for styling (no StyleSheet unless necessary)

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler cache issues:**
   ```bash
   npx expo start --clear
   ```

2. **NativeWind styles not applying:**
   - Ensure `global.css` is imported in `app/_layout.tsx`
   - Check `metro.config.js` configuration
   - Restart Metro bundler

3. **Font not loading:**
   - Verify font file is in `assets/fonts/`
   - Check font name in `useFonts()` hook
   - Ensure `SplashScreen` logic is correct

4. **Supabase connection issues:**
   - Verify `.env` variables are correct
   - Check Supabase project is active
   - Ensure RLS policies are set up

## 📄 License

This project is for educational and personal use.

## 🙏 Acknowledgments

- Quran data from AlQuran Cloud API
- Audio recitations from Islamic Network
- Inspired by the original Musabaqa Prep web app

## 📞 Support

For issues or questions:
- Check the implementation plan in `.claude/plans/`
- Review Expo documentation: https://docs.expo.dev
- Supabase docs: https://supabase.com/docs

---

**Built with ❤️ for the Muslim community**
