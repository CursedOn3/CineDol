# Installation & Setup Commands

## Complete Installation Process

Run these commands in order:

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
# Use any text editor to update the values
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Push Database Schema
```bash
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```

## Optional: Seed Database with Admin User

Create a file `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cinedol.com' },
    update: {},
    create: {
      email: 'admin@cinedol.com',
      name: 'Admin',
      password: hashedPassword,
      isAdmin: true,
      profiles: {
        create: {
          name: 'Admin',
        },
      },
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Then run:
```bash
npx tsx prisma/seed.ts
```

Admin credentials:
- Email: admin@cinedol.com
- Password: admin123

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run linter

# Database
npx prisma studio       # Open Prisma Studio GUI
npx prisma generate     # Generate Prisma Client
npx prisma db push      # Push schema to database
npx prisma db pull      # Pull schema from database
npx prisma migrate dev  # Create migration (if using migrations)

# Debugging
npm run dev -- --turbo  # Run with Turbo
```

## Verify Installation

After running the commands, verify everything works:

1. **Check server is running**: http://localhost:3000
2. **Check database connection**: `npx prisma studio`
3. **Check environment**: All variables in `.env` are set
4. **Register a user**: Go to /register
5. **Login**: Go to /login
6. **Browse content**: Go to /home

## Common Issues & Fixes

### Issue: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Prisma Client errors
```bash
npx prisma generate --force
```

### Issue: Database connection failed
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Try connecting with psql or pgAdmin

### Issue: Port 3000 in use
```bash
# Change port
PORT=3001 npm run dev
```

## Production Checklist

Before deploying to production:

- [ ] Set NODE_ENV=production
- [ ] Set secure NEXTAUTH_SECRET
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Set up production database
- [ ] Enable Google OAuth (if needed)
- [ ] Test all features
- [ ] Run `npm run build` successfully
- [ ] Check security headers
- [ ] Set up monitoring and logs
- [ ] Configure CDN for images
- [ ] Set up backup strategy

## Environment Variables Checklist

Required:
- [x] DATABASE_URL
- [x] NEXTAUTH_SECRET
- [x] NEXTAUTH_URL
- [x] TMDB_API_KEY
- [x] TMDB_API_READ_ACCESS_TOKEN

Optional:
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] ADMIN_EMAIL
- [ ] ADMIN_PASSWORD
