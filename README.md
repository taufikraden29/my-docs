# MyDoc - Documentation Platform

A modern documentation and blog platform built with React, Redux Toolkit, and Supabase.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development server
npm run dev
```

## 📚 Documentation

All detailed documentation is located in the `.doc` folder:

### Setup & Integration
- [Database Setup](.doc/DATABASE-SETUP.md) - Database schema and Supabase setup
- [Integration Guide](.doc/INTEGRATION-GUIDE.md) - Backend integration guide
- [Redux Migration](.doc/REDUX-MIGRATION-GUIDE.md) - Redux Toolkit setup

### Features Documentation
- [**NEW FEATURES**](.doc/NEW_FEATURES.md) - ✨ Latest features (Markdown preview, auto-save, search, etc.)
- [Features List](.doc/features.md) - Complete feature list
- [Enhanced Editor](.doc/ENHANCED-EDITOR-GUIDE.md) - Markdown editor features
- [Reader Features](.doc/READER-FEATURES-GUIDE.md) - Reading experience features
- [Copy Code Feature](.doc/COPY-CODE-FEATURE.md) - Code block copy functionality
- [Filter Feature](.doc/FILTER-FEATURE-GUIDE.md) - Post filtering system
- [Default Images](.doc/DEFAULT-IMAGES-GUIDE.md) - Image handling
- [Table of Contents Fix](.doc/TOC-FIX-GUIDE.md) - TOC implementation
- [Homepage Redesign](.doc/HOMEPAGE-REDESIGN-GUIDE.md) - Homepage design

### Other
- [Changelog](.doc/CHANGELOG.md) - Version history
- [Redux Status](.doc/REDUX-INTEGRATION-STATUS.md) - Redux implementation status
- [Markdown Test](.doc/MARKDOWN-TEST-EXAMPLE.md) - Markdown examples

## 🎯 Latest Features (v1.1.0)

### For Writers
1. **✅ Markdown Preview Split View** - Side-by-side editor with live preview
2. **✅ Draft Auto-Save** - Auto-save every 5 seconds with visual indicator
3. **✅ Search & Filter Posts** - Full-text search with category/status filters
4. **✅ Featured Image Upload** - Image URL with live preview
5. **✅ Reading Time Estimation** - Automatic calculation (200 wpm)
6. **✅ Bulk Actions** - Select multiple posts for batch operations

See [NEW_FEATURES.md](.doc/NEW_FEATURES.md) for detailed documentation.

## 🛠 Tech Stack

- **Frontend**: React 19, Redux Toolkit, React Router
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Markdown**: react-markdown, react-syntax-highlighter
- **Forms**: react-hook-form
- **Build**: Vite

## 📁 Project Structure

```
client/
├── .doc/              # All documentation files
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── store/         # Redux store & slices
│   ├── utils/         # Utility functions
│   └── hooks/         # Custom hooks
├── public/            # Static assets
└── dist/              # Build output
```

## 🔑 Environment Variables

Create `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Key Features

- **Rich Markdown Editor** with live preview
- **Syntax Highlighting** for code blocks
- **Auto-save** for drafts
- **Search & Filter** posts
- **Bulk Operations** for post management
- **Reading Progress** indicator
- **Table of Contents** auto-generation
- **Share Buttons** (Twitter, Facebook, LinkedIn, Email)
- **Responsive Design** for all devices

## 📖 Usage

### For Writers
1. Login to dashboard
2. Create/edit posts with markdown editor
3. Use live preview to see formatting
4. Add featured image URL
5. Select category and tags
6. Auto-save keeps your drafts safe
7. Publish when ready

### For Readers
1. Browse posts on homepage
2. Filter by category/tags
3. Read with progress indicator
4. Use table of contents for navigation
5. Share posts on social media

## 🐛 Known Issues

None at the moment. Check [CHANGELOG.md](.doc/CHANGELOG.md) for updates.

## 📄 License

Private project.

## 👥 Author

MyDoc Team

---

**Last Updated:** 2025-11-22  
**Version:** 1.1.0
