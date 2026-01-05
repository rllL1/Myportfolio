# Ron Hezykiel Arbois Portfolio - Admin Panel Setup Guide

## 🚀 Complete System with Admin Panel & Floating Chat

This portfolio includes a full-featured admin panel with Supabase integration for content management.

---

## 📋 Setup Instructions

### 1. **Install Dependencies**
All dependencies are already installed, including:
- `@supabase/supabase-js`
- `framer-motion`
- `lucide-react`

### 2. **Set Up Supabase**

#### Create a Supabase Project:
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be provisioned

#### Get Your Credentials:
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **Project URL**
3. Copy the **anon/public** key

#### Update Environment Variables:
Edit `.env.local` and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. **Run the SQL Schema**

1. In Supabase dashboard, go to **SQL Editor**
2. Open the `SQL_SCHEMA.sql` file from your project root
3. Copy and paste the entire SQL code
4. Click **Run** to execute

This will create all necessary tables:
- `admin_users`
- `hero_section`
- `skills`
- `projects`
- `project_tags`
- `timeline_items`
- `contact_messages`
- `chat_messages`
- `social_links`
- `site_settings`

### 4. **Create Admin User**

Since we're using Supabase Auth, create an admin user:

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter email and password
4. Click **Create user**

**OR** use SQL to create a test user:
```sql
-- In Supabase SQL Editor
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@example.com', crypt('your-password', gen_salt('bf')), NOW());
```

---

## 🎨 Features

### **Public Portfolio:**
- ✅ Hero section with profile image
- ✅ Skills marquee with categories
- ✅ Featured projects with hover effects
- ✅ Resume/Timeline with animations
- ✅ Contact section
- ✅ **Floating chat widget** (bottom-right corner)

### **Admin Panel:**
- ✅ Secure login page (`/admin`)
- ✅ Beautiful dashboard (`/admin/dashboard`)
- ✅ Sidebar navigation with:
  - Dashboard Overview
  - Hero Section Management
  - Skills Management
  - Projects Management
  - Resume/Timeline Management
  - Messages Inbox
  - Live Chat Management
  - Settings
- ✅ Stats cards with animations
- ✅ Quick actions
- ✅ Recent messages preview

### **Floating Chat:**
- ✅ Animated chat button (bottom-right)
- ✅ Real-time messaging interface
- ✅ Minimize/maximize functionality
- ✅ Online status indicator
- ✅ Message timestamps
- ✅ Smooth animations

---

## 🔐 Admin Panel Access

### Login:
1. Go to `http://localhost:3000/admin`
2. Enter your Supabase user credentials
3. You'll be redirected to the dashboard

### Dashboard:
Navigate to `http://localhost:3000/admin/dashboard` to access:
- Overview statistics
- Content management
- Message inbox
- Live chat

---

## 📂 Project Structure

```
ronportfolio/
├── app/
│   ├── admin/
│   │   ├── page.tsx              # Admin login
│   │   └── dashboard/
│   │       └── page.tsx          # Admin dashboard
│   ├── page.tsx                  # Main portfolio
│   └── layout.tsx
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx      # Admin sidebar nav
│   │   └── AdminTopbar.tsx       # Admin header
│   ├── FloatingChat.tsx          # Floating chat widget
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Resume.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── lib/
│   └── supabase.ts               # Supabase client
├── public/
│   ├── 1.png                     # Project images
│   ├── 2.jpg                     # Profile image
│   └── resume.pdf                # Resume PDF
├── .env.local                    # Environment variables
└── SQL_SCHEMA.sql                # Database schema
```

---

## 🎯 Usage

### Run Development Server:
```bash
npm run dev
```

### Access Points:
- **Portfolio**: `http://localhost:3000`
- **Admin Login**: `http://localhost:3000/admin`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`

---

## 🎨 Customization

### Colors:
The theme uses red and black. To change colors, update Tailwind classes:
- Primary: `red-600`
- Secondary: `red-700`
- Background: `black` and `#0a0a0a`

### Content:
- Update via Supabase database
- Or edit component files directly

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `admin_users` | Admin authentication |
| `hero_section` | Hero section content |
| `skills` | Skills with categories |
| `projects` | Project portfolio items |
| `project_tags` | Tags for projects |
| `timeline_items` | Work & education history |
| `contact_messages` | Contact form submissions |
| `chat_messages` | Floating chat messages |
| `social_links` | Social media links |
| `site_settings` | Global site settings |

---

## 🔒 Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Row Level Security (RLS)** is enabled on all tables
3. **Authentication** uses Supabase Auth
4. **API Keys** are environment-based

---

## 🚀 Deployment

### Vercel:
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings
4. Deploy

### Environment Variables in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 📧 Support

For issues or questions:
- Email: arboisron2@gmail.com
- GitHub: https://github.com/rllL1

---

## 🎉 Features Summary

✅ Modern, responsive design
✅ Framer Motion animations
✅ Floating chat widget
✅ Complete admin panel
✅ Supabase integration
✅ SQL database schema
✅ Secure authentication
✅ Content management system
✅ Real-time messaging
✅ Beautiful UI/UX

Enjoy your new portfolio with admin panel! 🚀
