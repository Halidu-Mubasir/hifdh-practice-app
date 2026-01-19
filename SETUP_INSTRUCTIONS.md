# Hifdh App Setup Instructions

This guide will help you set up the Hifdh App with Supabase authentication and Google OAuth.

## Prerequisites

- Node.js installed
- Expo CLI installed (`npm install -g expo-cli`)
- A Google Cloud account (for Google OAuth)

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Name**: Hifdh App
   - **Database Password**: (create a strong password and save it)
   - **Region**: Choose closest to your users
5. Click "Create new project" and wait for setup to complete (~2 minutes)

## Step 2: Get Supabase Credentials

1. Once your project is created, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace the placeholder values:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Gemini AI (optional for future features)
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

3. Save the file

## Step 4: Set Up Database Schema

1. In your Supabase project, click **SQL Editor** in the sidebar
2. Click **New query**
3. Copy and paste the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  trials_count INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trial results table
CREATE TABLE trial_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  trial_number INTEGER NOT NULL,
  surah_id INTEGER NOT NULL,
  surah_name TEXT NOT NULL,
  surah_english_name TEXT NOT NULL,
  start_ayah INTEGER NOT NULL,
  start_global_ayah_number INTEGER NOT NULL,
  end_surah_id INTEGER NOT NULL,
  end_surah_name TEXT NOT NULL,
  end_surah_english_name TEXT NOT NULL,
  end_ayah INTEGER NOT NULL,
  arabic_snippet TEXT,
  arabic_end_snippet TEXT,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  theme TEXT DEFAULT 'light',
  show_end_verse_snippet BOOLEAN DEFAULT false,
  preferred_reciter TEXT DEFAULT 'minshawi',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Sessions policies
CREATE POLICY "Users can view their own sessions"
  ON sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions"
  ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions"
  ON sessions FOR UPDATE USING (auth.uid() = user_id);

-- Trial results policies
CREATE POLICY "Users can view their own trial results"
  ON trial_results FOR SELECT
  USING (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert their own trial results"
  ON trial_results FOR INSERT
  WITH CHECK (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. Click **Run** to execute the SQL
5. You should see "Success. No rows returned"

## Step 5: Enable Google OAuth in Supabase

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API"
   - Click and enable it
4. Create OAuth credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - If prompted, configure OAuth consent screen first:
     - User Type: **External**
     - App name: **Hifdh App**
     - User support email: your email
     - Developer contact: your email
     - **Test users**: Add your email address (important for testing)
     - Save and continue through the rest
   - Application type: **Web application** (Yes, choose "Web application" even for mobile apps when using Supabase)
   - Name: **Hifdh App**
   - Authorized redirect URIs: Add **ONLY THIS URL**:
     - `https://tupdcxfiigewhvijykqd.supabase.co/auth/v1/callback`

     **Important**:
     - Replace with your actual Supabase project URL if different
     - Do NOT add `hifdh-app://` or `exp://` URLs here - Google Console won't accept them
     - Only the Supabase callback URL goes in Google Cloud Console
   - Click **Create**
   - Copy the **Client ID** and **Client Secret**

5. Configure Google OAuth in Supabase:
   - In your Supabase project, go to **Authentication** > **Providers**
   - Find **Google** and toggle it ON
   - Paste your Google **Client ID** and **Client Secret**
   - In the "Site URL" field (if shown), use: `https://tupdcxfiigewhvijykqd.supabase.co`
   - **Skip the "Redirect URLs" section** - Supabase handles this automatically
   - Click **Save**

**Why "Web application" for a mobile app?**
When using Supabase OAuth, all authentication flows go through Supabase's backend first (which is a web service), then redirect back to your mobile app. That's why you select "Web application" and only add the Supabase URL to Google Console.

## Step 6: Configure Email Settings (Optional but Recommended)

1. In Supabase, go to **Authentication** > **Email Templates**
2. Customize the email templates if desired
3. For production, configure a custom SMTP server in **Settings** > **Auth** > **SMTP Settings**

## Step 7: Test the App

1. Start the development server:
```bash
npx expo start
```

2. Open the app on your device or simulator
3. Try these features:
   - **Email Sign Up**: Should send a verification email
   - **Google Sign In**: Should open browser and authenticate
   - **Guest Mode**: Should work immediately without auth

## Troubleshooting

### Network Request Failed Error

If you see "Network request failed" when trying to sign up:

1. **Check your `.env` file**: Make sure the Supabase URL and anon key are correct
2. **Restart the dev server**: After changing `.env`, restart with:
   ```bash
   npx expo start -c
   ```
3. **Check internet connection**: Ensure your device/simulator can reach the internet
4. **Verify Supabase project**: Make sure your Supabase project is active (not paused)

### Google OAuth Not Working

1. **Check redirect URIs**: Make sure you added the correct redirect URI in Google Cloud Console
2. **Verify credentials**: Double-check Client ID and Secret in Supabase
3. **Clear cache**: Clear app data and restart
4. **Development mode**: For local testing, you may need to use Expo Go app

### Email Verification Not Sent

1. **Check email settings**: In Supabase, go to **Authentication** > **Settings**
2. **Confirm email enabled**: Make sure "Confirm email" is toggled ON
3. **Check spam folder**: Verification emails might be in spam
4. **Use custom SMTP**: For production, configure custom SMTP for better deliverability

## Environment Setup Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] `.env` file configured with Supabase credentials
- [ ] Google OAuth configured (optional but recommended)
- [ ] Email authentication tested
- [ ] App runs without errors

## Next Steps

Once setup is complete:

1. Test authentication flows (email, Google, guest)
2. Start practicing with different Quran categories
3. Try exporting session results to CSV
4. Customize settings (theme, reciter, etc.)

## Support

If you encounter issues:

1. Check the Metro bundler logs for error details
2. Verify all environment variables are set correctly
3. Ensure Supabase project is not paused
4. Check Supabase logs in the dashboard for auth errors

---

**Note**: The app works in guest mode even without Supabase configured. However, for cloud sync, user accounts, and multi-device access, proper Supabase setup is required.
