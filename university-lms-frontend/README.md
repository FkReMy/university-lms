# University LMS Frontend

A React + Vite based front-end for a University Learning Management System (LMS).  
It is designed around a PostgreSQL schema that models users, roles, courses, quizzes, assignments, grades, and file management.

---

## Tech Stack
- **Build tool:** Vite
- **Framework:** React (JSX, functional components, hooks)
- **Styling:** SCSS modules + global SCSS
- **State management:** Lightweight custom stores (e.g., Zustand) in `src/store/`
- **HTTP client:** Axios
- **Routing:** React Router
- **Realtime:** WebSocket client wrappers in `src/services/realtime/`
- *(Comment: You can swap libraries if you keep the structure intact.)*

---

## Project Structure
```text
university-lms-frontend/
├── public/                 # Static assets served as-is
└── src/
    ├── assets/             # Fonts, images, SVGs
    ├── styles/             # Global + partial SCSS
    ├── lib/                # Constants, utilities, validators, formatters
    ├── services/
    │   ├── api/            # Axios instance & feature-specific API modules
    │   └── realtime/       # WebSocket wrappers (notifications, quizzes, etc.)
    ├── store/              # App-level and domain-specific stores
    ├── hooks/              # Reusable hooks and domain hooks
    ├── router/             # React Router configuration and guards
    ├── components/         # UI library + feature components
    └── pages/              # Route-level pages grouped by domain
```

*(Comment: The folder layout maps cleanly to backend domains for easier maintenance.)*

Backend-aligned domains (example tables):
- `users`, `user_roles`, `admins`, `students`, `professors`, `associate_teachers`
- `departments`, `specializations`
- `course_catalog`, `course_offerings`, `course_enrollments`
- `section_groups`, `student_section_assignments`
- `academic_sessions`, `rooms`, `scheduled_slots`
- `quizzes`, `questions`, `question_options`, `quiz_attempts`, `quiz_answers`, `quiz_files`, `quiz_file_submissions`
- `assignments`, `assignment_files`, `assignment_submissions`
- `grades`
- `uploaded_files`

*(Comment: Each domain should have a `services/api/*Api.js` module and route pages in `src/pages/`.)*

---

## Getting Started

### Prerequisites
- Node.js (LTS recommended, e.g., >= 18)
- npm (or yarn/pnpm; scripts assume npm)

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```
*(Comment: Vite prints a local dev URL, usually http://localhost:5173.)*

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

---

## Environment Variables
Create a `.env` file in the project root (do **not** commit it):
```bash
cp .env.example .env
```

Typical variables:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_BASE_URL=ws://localhost:3000
```
*(Comment: Adjust to match your backend endpoints.)*

---

## Role-Based Access & Routing

Supported roles (from `user_roles.role`):
- `Admin`
- `Professor`
- `AssociateTeacher`
- `Student`

Front-end routing:
- `src/router/routes.jsx` – central route definitions
- `ProtectedRoute.jsx` – blocks unauthenticated users
- `AdminRoute.jsx`, `ProfessorRoute.jsx`, `AssociateRoute.jsx`, `StudentRoute.jsx` – role-based guards

Helpers & state:
- `src/store/authStore.js` – current user/role snapshot
- `src/hooks/useAuth.js` – login, logout, load current user
- `src/hooks/useRoleAccess.js` – role helpers (`isAdmin`, `isProfessor`, `canGrade`, etc.)
- `src/components/layout/RoleSwitcher.jsx` – dev-only role switcher (remove in prod)

*(Comment: Keep guards aligned with backend role definitions to avoid drift.)*

---

## API Layer

Domain-specific modules (examples):
- `authApi.js` – login, logout, refresh current user
- `userApi.js` – CRUD for users & roles
- `departmentApi.js` – departments & specializations
- `courseApi.js` – catalog and offerings
- `enrollmentApi.js` – enrollments
- `sectionApi.js` – sections and assignments
- `sessionApi.js` – academic sessions, rooms, schedule slots
- `quizApi.js` – quizzes, questions, options, attempts, answers, attachments
- `assignmentApi.js` – assignments and submissions
- `gradeApi.js` – grades and gradebook views
- `fileApi.js` – file uploads and library management

*(Comment: All use `axiosInstance.js` for base URL, auth headers, and interceptors.)*

---

## Styling

- `src/styles/global.scss` is imported in `main.jsx` (reset, tokens, typography).
- Component styles use `.module.scss` for scoping.
- Shared tokens and helpers:
  - `_variables.scss`
  - `_mixins.scss`
  - `_typography.scss`
  - `_themes.scss`
  - `_reset.scss`
  - `_animations.scss`

---

## Development Notes

- Use `src/lib/constants.js` to centralize enums/statuses (roles, quiz types, etc.).
- Keep forms, filters, and guards in sync with backend schema.
- Prefer feature folders in `pages/` and `components/` so each domain is easy to find.

---

## License
Internal / educational use.