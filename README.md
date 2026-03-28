# DiaMate

Unity for diabetes monitoring, personalized AI insights, and self-care tracking.

## 🚀 Project Overview

`diamate` is a modern full-stack health dashboard built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. It delivers a polished user experience for diabetes care: real-time blood glucose tracking, meal logging, medicine schedule, lab tests, foot ulcer imaging, and growth metrics.

The project is designed as a client-rendered experience with server-client data fetches from a secured API (via JWT). It includes a public marketing homepage, authentication flows, and a feature-rich app dashboard.

## 🌟 Core Features

- Landing page with product story, benefits, and CTA.
- Login / registration with JWT token storage and patient identity in cookies.
- Main dashboard summary (avg glucose, lab count, ulcer count, medicine count).
- Live blood glucose chart + overview card list.
- Quick log input for new glucose entries.
- Meal tracking (add + list) with nutrition fields.
- Lab test records and foot ulcer image support.
- Settings screen with user profile and theme toggling.
- Mobile-friendly responsive layout with light/dark mode.
- Placeholder chat module for future expansion.

## 🧩 Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- ESLint (with `eslint-config-next`)
- React icons: `lucide-react`, `react-icons`
- API auth: JWT cookie handling
- `js-cookie`, `jwt-decode` helpers

## 🗂️ Directory Structure

- `app/` - Next.js app routes
  - `(auth)/` - `/login`, `/register`
  - `(main)/` - dashboard pages: `/dashboard`, `/meal`, `/medicine`, `/lab-tests`, `/settings`, `/chat`
  - `page.tsx` - public landing page
- `app/globals.css` - global styling
- `middleware/` - route guards (auth protection, optional)
- `public/` - static assets (logo, images)
- `package.json` - scripts and package dependencies

## ⚙️ Environment Variables

Create `.env.local` in the project root with at least:

```bash
NEXT_PUBLIC_BASE_API=https://your-api-url.com/api
# (optional) Next.js default options
NEXTAUTH_URL=http://localhost:3000
```

The app uses `NEXT_PUBLIC_BASE_API` for API requests in components such as:
- `app/(main)/dashboard/_components/DashboardStats.tsx`
- `app/(main)/dashboard/_components/BloodGlucoseChart.tsx`
- `app/(main)/meal/_components/MealList.tsx`
- `app/(main)/main/quicklog` etc

## 🛠️ Setup & Run

1. install dependencies

   ```bash
   npm install
   ```

2. run in development

   ```bash
   npm run dev
   ```

3. build production

   ```bash
   npm run build
   npm run start
   ```

4. lint

   ```bash
   npm run lint
   ```

## 🔐 Auth Flow

- `app/(auth)/login/page.tsx` sends credentials to:
  - `${NEXT_PUBLIC_BASE_API}/Account/LogIn`
- On success it writes cookies:
  - `token` (JWT)
  - `patientId` parsed from JWT payload
- Protected pages rely on cookies in `app/(main)/...` and may redirect or fail if missing.

## 📡 API Endpoints (backend expectations)

- `/BloodGlucoseReading/GetAllReadingsForPatient/{patientId}`
- `/LabTest/GetAllTestsForPatient/{patientId}`
- `/FootUlcerImage/GetAllFootUlcerImagesForPatient/{patientId}`
- `/Medicine/GetAllMedicinesForPatient/{patientId}`
- `/BloodGlucoseReading/AddReading`, `/Meal/Add`, `/Medicine/Add`, etc.

Token bearer authorization is attached to protected fetch requests.

## 🧪 Testing Notes

- No tests included yet; add Jest + React Testing Library for unit/feature coverage.
- Use Test ID attributes quickly for UI selectors.

## 🛡️ Contribution

1. fork repository
2. create branch `feature/xyz`
3. commit and open PR

Include change summary, issue link, and screenshots for UI updates.

## 📝 Tips

- For local API mock, set `NEXT_PUBLIC_BASE_API=http://localhost:5000` (or your backend host).
- Use `app/(auth)/login` and `app/(main)/dashboard` flows for integration testing.

## 📄 License

MIT (or add your license) 

