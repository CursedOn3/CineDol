# CineDol - Netflix-Style Streaming Platform 🎬

<div align="center">

![CineDol Banner](https://i.postimg.cc/65fC7tFM/Screenshot-2025-01-24-162029.png)

A complete, production-ready streaming platform built with Next.js 14, TypeScript, and modern web technologies. Experience Netflix-quality streaming with real movie and TV show data from TMDB.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)

</div>

## ✨ Features

### 🎯 Core Functionality
- 🔐 **Full Authentication System**: NextAuth with Google OAuth and Email/Password
- 👥 **Multi-Profile Support**: Netflix-style user profiles (up to 5 per account)
- 🎥 **TMDB Integration**: Real-time movie and TV show data with 1M+ titles
- ▶️ **Video Streaming**: Multi-provider iframe system with automatic fallback
- 💾 **Watchlist**: Save movies and shows for later viewing
- ⏯️ **Continue Watching**: Resume playback from where you left off with timestamp tracking
- 🔍 **Advanced Search**: Real-time search with debouncing and auto-suggestions
- 🌐 **Internationalization**: English and Nepali language support
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- ⚡ **SEO Optimized**: Dynamic metadata, ISR caching, and sitemap generation

### 🎨 User Interface
- 🎭 **Netflix-Inspired Design**: Sleek, modern interface with smooth animations
- 🖼️ **Hero Banners**: Dynamic hero sections with backdrop images
- 📜 **Infinite Scroll**: Smooth infinite scrolling for content discovery
- 🎪 **Row Sliders**: Horizontal scrolling rows with touch support
- 🎨 **Profile Avatars**: Colorful, customizable user profile avatars
- 🌙 **Dark Theme**: Eye-friendly dark theme optimized for streaming

## 📸 Screenshots

<div align="center">

### Home Page
![Home Page](https://i.postimg.cc/65fC7tFM/Screenshot-2025-01-24-162029.png)

### TV Show Details
![TV Show Details](https://i.postimg.cc/JzDwCJc6/Screenshot-2025-01-24-162134.png)

### Movie Details with Cast
![Movie Details](https://i.postimg.cc/wBpLfxWk/Screenshot-2025-01-24-162112.png)

</div>

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **API**: TMDB (The Movie Database)
- **Deployment Ready**: Netlify/Vercel compatible

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database (local or cloud)
- TMDB API credentials (already provided in the project)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/CursedOn3/ConeDol.git
cd ConeDol
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
CineDol/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   ├── home/               # Home page
│   │   ├── movie/[id]/         # Movie details
│   │   ├── tv/[id]/            # TV show details
│   │   ├── watch/              # Video player
│   │   ├── login/              # Authentication
│   │   └── profiles/           # Profile management
│   ├── components/             # React components
│   │   ├── MovieCard.tsx       # Movie/TV card component
│   │   ├── VideoPlayer.tsx     # Video iframe player
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── HeroBanner.tsx      # Hero section
│   │   └── RowSlider.tsx       # Content slider
│   ├── lib/                    # Utilities and services
│   │   ├── tmdb.ts             # TMDB API client
│   │   ├── video-providers.ts  # Video provider config
│   │   └── prisma.ts           # Database client
│   ├── store/                  # Zustand stores
│   │   ├── playbackStore.ts    # Playback state
│   │   └── profileStore.ts     # Profile state
│   ├── i18n/                   # Internationalization
│   └── types/                  # TypeScript types
├── prisma/
│   └── schema.prisma           # Database schema
└── public/                     # Static assets
```

## 🎬 Features in Detail

### Authentication & Profiles
- Secure authentication with NextAuth.js
- Google OAuth integration
- Email/Password with bcrypt hashing
- Multi-profile support (up to 5 profiles per account)
- Profile management dashboard

### Content Discovery
- Browse trending movies and TV shows
- Explore by genre, rating, and release date
- Real-time search with TMDB API
- Infinite scroll pagination
- Dynamic content recommendations

### Video Playback
- Multi-provider video streaming (MoviesAPI)
- Responsive video player with controls
- Continue watching with timestamp tracking
- Auto-hide controls on inactivity
- Fullscreen support

### Data Management
- PostgreSQL database with Prisma ORM
- Efficient data caching with ISR
- Watchlist persistence
- Playback progress tracking
- User preferences storage

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
```

## 📚 Documentation

- [Setup Guide](SETUP.md) - Complete installation and configuration
- [Installation Guide](INSTALL.md) - Quick start guide
- [Project Summary](PROJECT_SUMMARY.md) - Architecture and features overview

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Movie and TV show data provided by [TMDB](https://www.themoviedb.org/)
- Inspired by Netflix's user interface
- Built with modern web technologies

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">

**Built with ❤️ using Next.js 14**

⭐ Star this repo if you find it helpful!

</div>
