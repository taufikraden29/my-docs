# MyDoc - Documentation & Blog Platform

A modern documentation and blog platform built with React, Vite, Tailwind CSS, and Supabase.

## 🚀 Features

### Frontend (Public)
- ✅ Homepage with latest posts
- ✅ Post detail page with markdown rendering
- ✅ Search functionality
- ✅ Responsive design (mobile-first)
- ✅ Category and tag filtering

### Dashboard (Private)
- ✅ User authentication (login/register)
- ✅ Dashboard overview with statistics
- ✅ CRUD operations for posts
- ✅ Category management
- ✅ Tag management
- ✅ Profile settings
- ✅ Markdown editor

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** TanStack Query (React Query)
- **Database & Auth:** Supabase
- **Markdown:** React Markdown
- **Form Handling:** React Hook Form

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or pnpm or yarn
- Supabase account and project

## ⚙️ Installation

### 1. Clone and Install Dependencies

```bash
cd client
npm install
```

### 2. Setup Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to **Settings** → **API**
   - Copy **Project URL** and **anon/public key**

3. Update `.env` file:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

### 3. Setup Database

Make sure you've run the SQL scripts in your Supabase project:

1. Run `../supabase-schema.sql` (required)
2. Run `../supabase-rls-policies.sql` (required)
3. Run `../supabase-sample-data.sql` (optional - for testing)

See `../DATABASE-SETUP.md` for detailed instructions.

### 4. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📁 Project Structure

```
client/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Layout/          # Layout components (Navbar, Footer)
│   │   ├── Post/            # Post-related components
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Auth/            # Login, Register
│   │   ├── Home/            # Homepage
│   │   ├── Post/            # Post detail
│   │   ├── Search/          # Search page
│   │   └── Dashboard/       # Dashboard pages
│   ├── services/            # API services
│   │   ├── authService.js
│   │   ├── postService.js
│   │   ├── categoryService.js
│   │   └── tagService.js
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.js
│   ├── lib/                 # Library configurations
│   │   ├── supabase.js
│   │   └── queryClient.js
│   ├── utils/               # Utility functions
│   │   └── slugify.js
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static files
├── .env                     # Environment variables
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎨 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Authentication

### Register New User

1. Navigate to `/register`
2. Fill in the form (email, password, username, full name)
3. Click "Create Account"
4. Check email for verification link (if enabled in Supabase)

### Login

1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In"
4. Redirected to `/dashboard`

## 📝 Using the Dashboard

### Create a Post

1. Login to dashboard
2. Click "New Post" button
3. Fill in post details (title, content, category, tags)
4. Choose status (draft or published)
5. Click "Save"

### Manage Categories

1. Go to Dashboard → Categories
2. Add, edit, or delete categories
3. Each category has a name, slug, description, and color

### Manage Tags

1. Go to Dashboard → Tags
2. Add, edit, or delete tags
3. Tags can be assigned to multiple posts

## 🌐 Public Pages

- **Home (`/`)** - List of all published posts
- **Post Detail (`/post/:slug`)** - Full post content with markdown
- **Search (`/search`)** - Search posts by title or content

## 🔒 Protected Pages (Require Login)

- **Dashboard (`/dashboard`)** - Overview and statistics
- **Posts (`/dashboard/posts`)** - Manage posts
- **Categories (`/dashboard/categories`)** - Manage categories
- **Tags (`/dashboard/tags`)** - Manage tags
- **Profile (`/dashboard/profile`)** - Update profile settings

## 🎯 Key Features

### Markdown Support

Posts are written in Markdown and rendered with `react-markdown`. Supports:
- Headers, paragraphs, lists
- Code blocks with syntax highlighting
- Images, links, blockquotes
- Bold, italic, strikethrough

### Search Functionality

- Full-text search across post titles and content
- Real-time search results
- Optimized database queries

### Responsive Design

- Mobile-first approach
- Tailwind CSS utility classes
- Responsive navbar with mobile menu
- Card-based layouts

### Performance Optimizations

- TanStack Query for caching and refetching
- Lazy loading for images
- Optimized Supabase queries
- Debounced search input

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database (Supabase)

Database is already hosted on Supabase (managed service).

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

- Make sure `.env` file exists and contains correct values
- Restart dev server after changing `.env`

### "Failed to fetch posts"

- Check Supabase connection (URL and key)
- Verify RLS policies are set up correctly
- Check browser console for errors

### Authentication not working

- Verify email confirmation is disabled in Supabase (for testing)
- Check if profile is created automatically (trigger should handle this)

### Posts not showing

- Make sure posts have `status = 'published'`
- Check if `published_at` is set
- Verify user is authenticated for drafts

## 📚 Additional Documentation

- **Database Setup:** `../DATABASE-SETUP.md`
- **API Endpoints:** `../API-ENDPOINTS.md`
- **ER Diagram:** `../ER-DIAGRAM.md`
- **Quick Start:** `../QUICK-START.md`

## 🔑 Default Test User (if using sample data)

Create a user via Supabase Authentication dashboard first, then use those credentials to login.

## 📄 License

Free to use for personal and commercial projects.

## 🤝 Contributing

This is a personal project template. Feel free to fork and customize!

---

**Built with ❤️ using React, Vite, Tailwind CSS, and Supabase**
