# CINEQ Movie Review Website (Dynamic Airtable CMS)

This is a full-stack movie review and news site using:
- Next.js (frontend & routing)
- Tailwind CSS (styling)
- Airtable (CMS backend)
- Vercel (deployment)

## ✅ Features:
- Homepage with dynamic sections (Trending, Ads, Reviews)
- Pages: Reviews, News, Upcoming, Interviews
- Airtable integration for content management
- Responsive layout with ad slots
- Ready to deploy on Vercel

## 📦 Project Structure
- `/pages` – Page routes (Home, Reviews, News, etc.)
- `/components` – Reusable UI components
- `/lib` – Airtable API logic
- `/public` – Static assets like images, logos
- `/styles` – Tailwind CSS

## 🔧 Setup

1. Clone the repo:
```bash
git clone https://github.com/your-username/cineq-site.git
cd cineq-site
```

2. Install dependencies:
```bash
npm install
```

3. Set environment variables (in `.env.local`):
```
AIRTABLE_TOKEN=your_airtable_token
AIRTABLE_BASE_ID=your_airtable_base_id
```

4. Run locally:
```bash
npm run dev
```

5. Deploy to Vercel from GitHub

Happy publishing!
