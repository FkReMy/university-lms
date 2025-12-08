# University LMS Frontend

A React + Vite based front-end for a University Learning Management System (LMS).  
It is designed around a PostgreSQL schema that models users, roles, courses, quizzes, assignments, grades, and file management.

---

## Tech Stack

- **Build tool:** Vite
- **Framework:** React (JSX, functional components, hooks)
- **Styling:** SCSS modules + global SCSS
- **State management:** Lightweight custom stores (e.g. Zustand or similar pattern) in `src/store/`
- **HTTP client:** Axios
- **Routing:** React Router
- **Realtime:** WebSocket client wrappers in `src/services/realtime/`

You can swap out the exact libraries if needed; the structure is kept generic.

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

The structure is aligned with the backend schema tables like:

- `users`, `user_roles`, `admins`, `students`, `professors`, `associate_teachers`
- `departments`, `specializations`
- `course_catalog`, `course_offerings`, `course_enrollments`
- `section_groups`, `student_section_assignments`
- `academic_sessions`, `rooms`, `scheduled_slots`
- `quizzes`, `questions`, `question_options`, `quiz_attempts`, `quiz_answers`, `quiz_files`, `quiz_file_submissions`
- `assignments`, `assignment_files`, `assignment_submissions`
- `grades`
- `uploaded_files`

Each domain has a corresponding `services/api/*Api.js` module and route pages in `src/pages/`.

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended, e.g. >= 18)
- npm (or yarn/pnpm, but this template assumes npm)

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Vite will print a local dev URL (usually http://localhost:5173).

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

Typical variables might include:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_BASE_URL=ws://localhost:3000
```

Adjust these according to your backend.

---

## Role-Based Access & Routing

The system supports the following roles:

- `Admin`
- `Professor`
- `AssociateTeacher`
- `Student`

These map directly from the `user_roles.role` column in the database.

Front-end routing structure:

- `src/router/routes.jsx` – central definition of all routes.
- `ProtectedRoute.jsx` – blocks unauthenticated users.
- `AdminRoute.jsx`, `ProfessorRoute.jsx`, `AssociateRoute.jsx`, `StudentRoute.jsx` – apply role-based guards.

Helpers & state:

- `src/store/authStore.js` – current user and role snapshot.
- `src/hooks/useAuth.js` – login, logout, load current user.
- `src/hooks/useRoleAccess.js` – `isAdmin`, `isProfessor`, `canGrade`, etc.
- `src/components/layout/RoleSwitcher.jsx` – dev-only role switcher for testing (can be removed in production).

---

## API Layer

All backend calls are organized by domain:

- `authApi.js` – login, logout, refresh current user
- `userApi.js` – CRUD for users & roles
- `departmentApi.js` – departments & specializations
- `courseApi.js` – course catalog and offerings
- `enrollmentApi.js` – enrollments
- `sectionApi.js` – section groups and student section assignments
- `sessionApi.js` – academic sessions, rooms, schedule slots
- `quizApi.js` – quizzes, questions, options, attempts, answers, quiz attachments, file submissions
- `assignmentApi.js` – assignments and submissions
- `gradeApi.js` – grades and gradebook views
- `fileApi.js` – file uploads and library management

All of them use `axiosInstance.js` which sets the base URL, authorization headers, and interceptors.

---

## Styling

- `src/styles/global.scss` is imported in `main.jsx` and sets the base theme, reset, tokens, and typography.
- Component-level styles use `.module.scss` for local scoping.
- Shared variables, mixins, typography, and themes live in:
  - `_variables.scss`
  - `_mixins.scss`
  - `_typography.scss`
  - `_themes.scss`
  - `_reset.scss`
  - `_animations.scss`

---

## Development Notes

- Use `src/lib/constants.js` to centralize:
  - enums from the DB (roles, quiz types, question types, etc.)
  - application statuses for offerings, enrollments, etc.
- This keeps forms, filters, and guards in sync with the backend schema.
- Prefer **feature folders** under `pages/` and `components/` so each database domain has a clear front-end home.

---

## License

Internal / educational use. Add a proper license here once decided.