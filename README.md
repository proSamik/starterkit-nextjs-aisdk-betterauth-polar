# Polar SaaS Kit - Next.js Starter

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cgoinglove/nextjs-polar-starter-kit&env=BETTER_AUTH_SECRET&env=POLAR_ACCESS_TOKEN&envDescription=Learn+more+about+how+to+get+the+API+Keys+for+the+application&envLink=https://github.com/cgoinglove/nextjs-polar-starter-kit/blob/main/.env.example&demo-title=Polar+SaaS+Kit&demo-description=Production-ready+Next.js+starter+with+Polar.sh+payments,+Better+Auth,+and+premium+features&products=[{"type":"integration","protocol":"storage","productSlug":"neon","integrationSlug":"neon"}])

[![GitHub Sponsors](https://img.shields.io/github/sponsors/prosamik?style=for-the-badge&logo=github&logoColor=white&labelColor=black&color=pink)](https://github.com/sponsors/prosamik)

**The complete production-ready Next.js starter kit for building modern SaaS applications with payments, authentication, and premium features.**

🚀 **Built with the latest and greatest:**
- ⚡ **Next.js 15** - React framework with App Router
- 💳 **Polar.sh** - Modern payments and subscription management
- 🔐 **Better Auth** - Authentication with OAuth and sessions
- 🗄️ **PostgreSQL + Drizzle ORM** - Type-safe database operations
- 🎨 **20+ Theme Variants** - Beautiful theming system with dark mode
- 🏢 **Production-Ready** - Sidebar navigation, user management, premium features

Perfect for SaaS applications, premium tools, and any web app that needs user accounts with subscription management.

## ✨ Features

### 🔐 **Authentication & User Management**
- Email/password authentication with Better Auth
- OAuth providers (GitHub, Google) with account linking
- Secure session management (7-day expiration)
- User preferences and profile management
- Protected route groups for premium features

### 💳 **Payments & Billing (Polar.sh)**
- Subscription management (monthly/yearly plans)
- One-time payments (lifetime deals)
- Automatic customer creation and linking
- Graceful error handling for payment failures
- Customer portal managed by Polar

### 🎨 **Premium UI & Theming**
- **20+ built-in themes**: Default, Cyberpunk Neon, Tropical Paradise, Zen Garden, etc.
- Responsive sidebar navigation with collapsible design
- Theme-aware components using CSS custom properties
- Dark/light mode support for all themes
- Mobile-first responsive design

### 🏢 **Production Features**
- Dashboard with subscription status and analytics
- User profile management with avatar support
- Settings page with theme selection
- Landing page with pricing tiers
- Internationalization support (7 languages)

### 🛠️ **Developer Experience**
- TypeScript everywhere with strict mode
- Biome for fast linting and formatting
- Hot reload development server
- Docker support for easy deployment
- Comprehensive error handling

## 🚀 Quick Start

### Prerequisites

```bash
# Install pnpm (recommended package manager)
npm install -g pnpm

# Verify Node.js version (18+ required)
node --version
```

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/cgoinglove/nextjs-polar-starter-kit.git
cd nextjs-polar-starter-kit

# Install dependencies
pnpm install

# Run post-install setup
pnpm postinstall
```

### 2. Environment Setup

Create your environment file:

```bash
# Copy the example environment file
cp .env.example .env

# Or use the built-in script
pnpm initial:env
```

### 3. Configure Environment Variables

Open `.env` and configure the following:

#### 🔐 **Required - Authentication**
```env
# Generate a random secret key (32+ characters)
BETTER_AUTH_SECRET=your-super-secret-key-here-make-it-long-and-random

# Base URL for authentication callbacks
BETTER_AUTH_URL=http://localhost:3000  # Local development
# BETTER_AUTH_URL=https://yourdomain.com  # Production
```

#### 💳 **Required - Polar.sh Payments**
```env
# Get your Polar access token (see setup guide below)
POLAR_ACCESS_TOKEN=polar_at_xxxxxxxxxxxxx

# Product IDs from your Polar dashboard
POLAR_MONTHLY_PRODUCT_ID=prod_xxxxxxxxxxxxx
POLAR_YEARLY_PRODUCT_ID=prod_xxxxxxxxxxxxx
POLAR_LIFETIME_PRODUCT_ID=prod_xxxxxxxxxxxxx
```

#### 🗄️ **Required - Database**
```env
# Local development (using Docker)
POSTGRES_URL=postgres://postgres:password@localhost:5432/polar_saas

# NeonDB (Recommended for production)
# POSTGRES_URL=postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# Or use other cloud providers (Supabase, Railway, etc.)
# POSTGRES_URL=postgresql://username:password@your-db-host:5432/database
```

#### 🔗 **Optional - OAuth Providers**
```env
# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### ⚙️ **Optional - Additional Settings**
```env
# Disable user registration (default: false)
DISABLE_SIGN_UP=false

# Allow non-HTTPS cookies for local development
NO_HTTPS=true
```

### 4. Database Setup

#### Option A: Local PostgreSQL with Docker (Recommended)

```bash
# Start PostgreSQL container
pnpm docker:pg

# Run database migrations
pnpm db:migrate

# (Optional) Open Drizzle Studio to view/edit data
pnpm db:studio
```

#### Option B: NeonDB (Recommended for Production)

NeonDB is a serverless PostgreSQL database perfect for modern applications:

1. **Quick Setup:**
   ```bash
   # Follow the detailed NeonDB setup guide
   cat NEON_SETUP.md
   ```

2. **Get your NeonDB connection string** and add it to `.env`:
   ```env
   POSTGRES_URL=postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

3. **Run migrations:**
   ```bash
   pnpm db:migrate
   ```

#### Option C: Other Cloud Database Providers

- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- [PlanetScale](https://planetscale.com)

Follow the same process as NeonDB but without the SSL requirement.

### 5. Polar.sh Setup (Payment Provider)

#### Step 1: Create Polar Account
1. Visit [polar.sh](https://polar.sh) and sign up
2. Complete your organization setup
3. Verify your account

#### Step 2: Get Access Token
1. Go to **Settings** → **API Keys** in your Polar dashboard
2. Click **Create new token**
3. Name it "SaaS Kit Development"
4. Copy the token (starts with `polar_at_`)
5. Add it to your `.env` file:
   ```env
   POLAR_ACCESS_TOKEN=polar_at_xxxxxxxxxxxxx
   ```

#### Step 3: Create Products
1. Go to **Products** in your Polar dashboard
2. Create three products:

   **Monthly Subscription:**
   - Name: "Pro Monthly"
   - Type: Subscription
   - Price: $19/month
   - Copy the Product ID to `POLAR_MONTHLY_PRODUCT_ID`

   **Yearly Subscription:**
   - Name: "Pro Yearly" 
   - Type: Subscription
   - Price: $180/year
   - Copy the Product ID to `POLAR_YEARLY_PRODUCT_ID`

   **Lifetime Deal:**
   - Name: "Lifetime Access"
   - Type: One-time
   - Price: $299
   - Copy the Product ID to `POLAR_LIFETIME_PRODUCT_ID`

### 6. Start Development

Common commands:
```bash
# Start the development server
pnpm dev

# Open your browser
# http://localhost:3000
```

## 🏗️ Project Structure

```
polar-saaskit/
├── 📁 src/
│   ├── 📁 app/                     # Next.js App Router
│   │   ├── 📁 (auth)/             # Public authentication pages
│   │   │   ├── sign-in/           # Sign in page
│   │   │   └── sign-up/           # Sign up page  
│   │   ├── 📁 (premium)/          # Protected premium features
│   │   │   ├── app/               # Main app interface
│   │   │   │   └── page.tsx       # Dashboard with sidebar
│   │   │   └── layout.tsx         # Premium layout
│   │   ├── 📁 api/                # API routes
│   │   │   └── auth/              # Better Auth endpoints
│   │   ├── pricing/               # Landing page pricing
│   │   ├── page.tsx               # Landing page
│   │   └── layout.tsx             # Root layout
│   ├── 📁 components/             # React components
│   │   ├── 📁 ui/                 # Reusable UI components
│   │   ├── 📁 layouts/            # Layout components
│   │   ├── 📁 landing/            # Landing page sections
│   │   ├── dashboard.tsx          # Dashboard with stats
│   │   ├── profile.tsx            # User profile
│   │   └── settings.tsx           # Settings with themes
│   ├── 📁 lib/                    # Core libraries
│   │   ├── 📁 auth/               # Authentication config
│   │   ├── 📁 db/                 # Database & migrations
│   │   ├── utils.ts               # Utility functions
│   │   └── const.ts               # App constants
│   └── 📁 types/                  # TypeScript definitions
├── 📁 messages/                   # Internationalization
├── 📁 public/                     # Static assets
├── 📁 docker/                     # Docker configuration
└── 📁 scripts/                    # Build scripts
```

## 🎨 Theme System

This starter includes **20+ beautiful themes** with full dark mode support:

### Base Themes
- **Default** - Clean and modern
- **Zinc** - Subtle and professional  
- **Slate** - Cool blue-gray tones
- **Stone** - Warm neutral palette
- **Gray** - Classic grayscale
- **Blue** - Vibrant blue accents
- **Orange** - Energetic orange highlights
- **Pink** - Soft pink aesthetics

### Special Themes
- **Bubblegum Pop** - Playful pink and purple
- **Cyberpunk Neon** - Electric blues and magentas
- **Retro Arcade** - 80s gaming nostalgia
- **Tropical Paradise** - Ocean blues and sunset orange
- **Steampunk Cogs** - Industrial brass and copper
- **Neon Synthwave** - Retro-futuristic neon
- **Pastel Kawaii** - Soft pastel cuteness
- **Space Odyssey** - Deep space blues and stars
- **Vintage Vinyl** - Classic record warmth
- **Misty Harbor** - Foggy blues and grays
- **Zen Garden** - Natural greens and earth tones

Users can switch themes instantly via the Settings page in the sidebar.

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Deploy to Vercel:**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cgoinglove/nextjs-polar-starter-kit)

2. **Configure Environment Variables:**
   - Add all required environment variables from your `.env` file
   - Update `BETTER_AUTH_URL` to your Vercel domain
   - Use a production database (Neon recommended)

3. **Database Setup for Production:**
   ```bash
   # Option 1: Use Neon (Recommended)
   # 1. Sign up at neon.tech
   # 2. Create a new project
   # 3. Copy connection string to POSTGRES_URL
   
   # Option 2: Use Vercel Postgres
   # 1. Go to Vercel Dashboard → Storage → Create Database
   # 2. Choose PostgreSQL
   # 3. Environment variables are auto-added
   ```

4. **Run Production Migrations:**
   ```bash
   # Connect to your production database
   pnpm db:migrate
   ```

### Docker Deployment

```bash
# Build and start with Docker Compose
pnpm docker-compose:up

# Or build manually
docker build -t polar-saas-kit .
docker run -p 3000:3000 polar-saas-kit
```

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🛠️ Development Commands

### Core Commands
```bash
pnpm dev                  # Start development server
pnpm build               # Build for production  
pnpm start               # Start production server
pnpm lint                # Run Biome linter
pnpm format              # Format code
```

### Database Commands
```bash
pnpm db:generate         # Generate new migrations
pnpm db:migrate          # Run pending migrations
pnpm db:studio           # Open Drizzle Studio
pnpm db:push            # Push schema changes (dev only)
```

### Docker Commands
```bash
pnpm docker:pg           # Start PostgreSQL only
pnpm docker:app          # Start app only
pnpm docker-compose:up   # Start full stack
pnpm docker-compose:down # Stop all services
```

### Utility Commands
```bash
pnpm initial:env         # Generate .env from .env.example
pnpm postinstall         # Post-installation setup
pnpm clean               # Clean build artifacts
```

## 🏛️ Architecture

### Authentication Flow
1. **User signs up/in** → Better Auth handles authentication
2. **Polar customer created** → Automatic customer linking
3. **Session established** → 7-day session with refresh
4. **Route protection** → Access to premium features

### Payment Flow
1. **User selects plan** → Redirected to Polar checkout
2. **Payment processed** → Polar handles payment securely
3. **Webhook received** → Subscription status updated
4. **Access granted** → Premium features unlocked

### Database Schema
- **User table** - User accounts and preferences
- **Session table** - Authentication sessions
- **Account table** - OAuth provider accounts
- **Verification table** - Email verification codes

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style (Biome formatting)
- Add TypeScript types for all new code
- Write JSDoc comments for functions
- Test authentication flows thoroughly
- Use theme-aware CSS custom properties

## 📧 Support

- **Documentation**: Check the [cursor rules](.cursorrules) for detailed development guidelines
- **Issues**: [GitHub Issues](https://github.com/cgoinglove/nextjs-polar-starter-kit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cgoinglove/nextjs-polar-starter-kit/discussions)

## 💖 Sponsor

If this starter kit helps you build amazing SaaS applications, consider sponsoring the development:

[![GitHub Sponsors](https://img.shields.io/github/sponsors/prosamik?style=for-the-badge&logo=github&logoColor=white&labelColor=black&color=pink)](https://github.com/sponsors/prosamik)

Your support helps maintain and improve this project for the entire community.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework for production
- [Better Auth](https://better-auth.com) - Modern authentication for web apps
- [Polar.sh](https://polar.sh) - Simple, powerful payments for developers
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM for SQL databases
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Radix UI](https://radix-ui.com) - Accessible component primitives

---

**Built with ❤️ by [prosamik](https://github.com/prosamik)**
