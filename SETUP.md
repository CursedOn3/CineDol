# CineDol - Complete Setup Guide

## Quick Start

Follow these steps to get the CineDol streaming platform up and running on your local machine.

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Prisma ORM
- NextAuth
- TailwindCSS
- Zustand
- Framer Motion
- And more...

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file and update the following:

### Database Configuration
```env
# For PostgreSQL (recommended)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Example for local PostgreSQL:
DATABASE_URL="postgresql://postgres:password@localhost:5432/cinedol"

# For MongoDB (alternative):
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/cinedol"
```

### NextAuth Configuration
```env
# Generate a secret key with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Google OAuth (Optional)
If you want Google sign-in:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy credentials to `.env`:

```env
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### TMDB API (Already Configured)
The TMDB credentials are already provided in the prompt:
```env
TMDB_API_KEY="2031e307a67da00280bcbb7659383f5d"
TMDB_API_READ_ACCESS_TOKEN="eyJhbGciOiJIUzI1NiJ9..."
```

## Step 3: Set Up the Database

### Option A: PostgreSQL (Recommended)

1. **Install PostgreSQL** (if not already installed):
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)
   - Mac: `brew install postgresql@14`
   - Linux: `sudo apt-get install postgresql`

2. **Create the database**:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cinedol;

# Exit psql
\q
```

3. **Run Prisma migrations**:
```bash
npx prisma generate
npx prisma db push
```

### Option B: Use a Cloud Database

**Supabase (Free PostgreSQL)**:
1. Go to [supabase.com](https://supabase.com/)
2. Create a new project
3. Get the connection string from Settings > Database
4. Update DATABASE_URL in `.env`

**Railway**:
1. Go to [railway.app](https://railway.app/)
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update DATABASE_URL in `.env`

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 5: Create Your First User

1. Navigate to `http://localhost:3000/register`
2. Sign up with email and password (or use Google OAuth)
3. You'll be redirected to create a profile
4. Start browsing movies and TV shows!

## Step 6: Access Admin Panel (Optional)

To make yourself an admin:

1. **Using Prisma Studio**:
```bash
npx prisma studio
```
- Open Prisma Studio (usually at http://localhost:5555)
- Find your user in the `User` table
- Set `isAdmin` to `true`
- Save

2. **Using Database CLI**:
```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'your@email.com';
```

3. Log out and log back in
4. Access admin panel at `http://localhost:3000/admin`

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists
- Check firewall settings

### Prisma Issues
```bash
# Reset Prisma
npx prisma generate --force
rm -rf node_modules/.prisma
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Production Deployment

### Deploy to Vercel

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**:
- Go to [vercel.com](https://vercel.com/)
- Import your GitHub repository
- Add environment variables
- Deploy!

3. **Set up production database**:
- Use Vercel Postgres, Supabase, or Railway
- Update DATABASE_URL in Vercel environment variables
- Redeploy

### Environment Variables for Production

Make sure to set all these in your production environment:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL (your production URL)
- GOOGLE_CLIENT_ID (if using OAuth)
- GOOGLE_CLIENT_SECRET (if using OAuth)
- TMDB_API_KEY
- TMDB_API_READ_ACCESS_TOKEN

## Features Overview

### For Users
- Browse trending movies and TV shows
- Search for content
- Watch trailers
- Play movies and TV shows with multiple streaming providers
- Add content to watchlist
- Resume watching from where you left off
- Multiple profiles per account
- Switch between English and Nepali languages

### For Admins
- View user statistics
- Manage custom content
- View recent activity
- Monitor platform usage

## Development Tips

### Run Prisma Studio
```bash
npx prisma studio
```
View and edit database records in a GUI

### Check Logs
```bash
npm run dev
```
Console will show all server and client logs

### Format Code
```bash
npm run lint
```

### Build for Production
```bash
npm run build
npm start
```

## Next Steps

1. **Customize the Theme**: Edit `tailwind.config.ts`
2. **Add More Translations**: Edit files in `src/i18n/locales/`
3. **Customize Video Providers**: Edit `src/lib/video-providers.ts`
4. **Add Custom Content**: Use the admin panel
5. **Configure SEO**: Edit metadata in page files

## Support

If you encounter any issues:
1. Check this guide first
2. Review error messages carefully
3. Check the README.md file
4. Review the code structure

## Congratulations! 🎉

Your Netflix-style streaming platform is now set up and running!

Visit `http://localhost:3000` and start exploring.
