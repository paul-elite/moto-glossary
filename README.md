# Moto Glossary

A beautiful, monochrome glossary application for ride-hailing terms, built with Next.js and Supabase.

## Features

- 🖤 **Monochrome Design**: Sleek black and grey aesthetic with green primary accents.
- 📋 **Collapsible List**: Compact view that expands to show descriptions and rules.
- ✨ **Smooth Animations**: Staggered entry animations and fluid transitions.
- 💾 **Supabase Integration**: Persistent data storage with real-time capabilities.
- ➕ **CRUD Operations**: Add, edit, and delete glossary entries easily.

## Tech Stack

- **Framework**: Next.js 15+
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Heroicons (SVG)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/paul-elite/moto-glossary.git
cd moto-glossary
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the following SQL in your Supabase SQL Editor to create the necessary table:
```sql
CREATE TABLE glossary_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rules TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Run the development server
```bash
npm run dev
```

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Connect your GitHub repository to Vercel.
2. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
3. Deploy!
