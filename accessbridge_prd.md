# Product Requirements Document (PRD)
## Project Title: AccessBridge – Digital Course Access for Underserved Communities

### 1. Overview
AccessBridge aims to provide people from low-income backgrounds or older adults with access to certified digital education via Google and Microsoft courses. The MVP will include:
- A landing page with a form to collect user interest.
- A simple course directory after approval.
- Admin access to review submissions and approve users.

### 2. Goals
- Increase accessibility to digital certifications.
- Collect and manage user interest.
- Track engagement and popular courses.
- Keep the platform lightweight and low-cost.

### 3. Key Features
#### Phase 1: Landing Page
- Engaging, simple, responsive design.
- Form with fields:
  - Name
  - Phone Number
  - Course of Interest (text or dropdown)
- Submit button.
- Confirmation message after submission.

#### Phase 2: Admin Panel
- View list of submissions.
- Approve/reject users.
- Export CSV or view in dashboard.

#### Phase 3: Courses Page (for approved users)
- Login / token-based access (simple JWT or magic link).
- Course list:
  - Course Title
  - Brief Description
  - Link to official course (Google/Microsoft)
- Filter by interest/topic.

### 4. Tech Stack
#### Frontend:
- React + Vite
- TypeScript
- TailwindCSS (for rapid styling)
- React Hook Form or Formik
- Zustand or Context API for simple state

#### Backend:
- Node.js + Express
- TypeScript
- MongoDB (Atlas free tier or local)
- Nodemailer (optional – email confirmation)
- JWT for basic auth or admin area

#### Hosting Options:
- Frontend: Vercel / Netlify (free tiers)
- Backend: Render / Railway (free tiers)
- Database: MongoDB Atlas (free tier)

### 5. Data Flow
1. User visits landing page → fills form → data sent to backend.
2. Backend stores submission (pending approval).
3. Admin logs in → sees pending users → approves.
4. Approved user receives course link screen access.

### 6. API Endpoints (Draft)
```
POST /api/interest
GET /api/admin/submissions
POST /api/admin/approve/:id
GET /api/courses (only for approved users)
```

### 7. Non-Functional Requirements
- Responsive UI for mobile users.
- Simple UX for elderly or low-tech experience.
- Store data securely (hash phone number or obfuscate if needed).
- Localization-ready (eventually add Spanish or others).

### 8. Stretch Goals / V2 Ideas
- WhatsApp bot integration.
- Analytics for most selected courses.
- Notifications or reminders for incomplete certifications.
- Invite-a-friend or referral tracking.

### 9. Milestones
| Milestone | Description | ETA |
|----------|-------------|-----|
| M1 | Design & deploy landing page | 1 week |
| M2 | Backend to receive/store data | 1 week |
| M3 | Admin panel with approval logic | 1 week |
| M4 | Course access page | 1 week |