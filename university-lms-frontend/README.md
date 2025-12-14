# University LMS Frontend

A **production-ready React + Vite** frontend for a University Learning Management System (LMS), to be connected to a Python FastAPI (MVC) backend using PostgreSQL.

---

## Tech Stack

- **Build tool:** Vite
- **Framework:** React (JSX, functional components, hooks)
- **Styling:** SCSS modules + global SCSS tokens
- **UI:** Centralized, reusable global components (Button, Input, Select, Table, Badge, Card, Sidebar, Topbar, etc.)
- **State management:** Global store (Zustand or equivalent) in `src/store/`
- **HTTP client:** Axios with interceptors
- **Routing:** React Router v6+
- **Realtime:** WebSocket support in `src/services/realtime/`

---

## Project Structure

```txt
university-lms-frontend/
├── public/                   # Static, publicly served assets
└── src/
    ├── assets/               # Fonts, images, SVGs
    ├── styles/               # Global SCSS, tokens, themes
    ├── lib/                  # Utilities, constants, validators, formatters
    ├── services/
    │   ├── api/              # API adapters for each domain (axios-based)
    │   └── realtime/         # WebSocket/service wrappers
    ├── store/                # Global and domain-specific store modules
    ├── hooks/                # Custom and domain hooks
    ├── router/               # Routing config, guards, route helpers
    ├── components/           # Global UI library and feature components
    └── pages/                # Route-level pages by domain (no business logic here)
```

> **Folder layout is aligned to backend and database domains for traceable, maintainable development.**

**Typical backend-aligned domains:**
- users, user_roles, admins, students, professors, associate_teachers
- departments, specializations
- course_catalog, course_offerings, course_enrollments
- section_groups, student_section_assignments
- academic_sessions, rooms, scheduled_slots
- quizzes, questions, question_options, quiz_attempts, quiz_answers, quiz_files, quiz_file_submissions
- assignments, assignment_files, assignment_submissions
- grades, uploaded_files

Each should have a matching API module and page(s).

---

## Getting Started

### Prerequisites
- [Node.js LTS](https://nodejs.org/) (v18+ strongly recommended)
- npm (or yarn/pnpm – scripts assume npm)

### Install dependencies
```bash
npm install
```

### Run in development
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build locally
```bash
npm run preview
```

---

## Environment Variables

1. Copy `.env.example` to `.env` (never commit secrets):
    ```sh
    cp .env.example .env
    ```
2. Example:
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api
    VITE_WS_BASE_URL=ws://localhost:8000/ws
    ```
3. Adjust as needed for your backend service URLs.

---

## Role-Based Access & Routing

- Roles: Admin, Professor, AssociateTeacher, Student (see `user_roles` table)
- Routing: Defined centrally in `src/router/routes.jsx`
    - Role-based redirect/guards (AdminRoute, ProfessorRoute, etc.)
    - Use `<ProtectedRoute>` for authentication checks
- State: Auth/user in `src/store/authStore.js`
- Auth helpers: `src/hooks/useAuth.js`, `useRoleAccess.js`
- Navigation: Always use global Sidebar and Topbar for unified experience
- UI navigation: All internal links use `<Link>` from React Router

---

## API Layer

- API logic modularized in `src/services/api/DOMAINApi.js`
    - All use a shared `axiosInstance.js` for consistent auth/headers/interceptors
- Example modules:  
  `authApi.js`, `userApi.js`, `departmentApi.js`, `courseApi.js`, `enrollmentApi.js`, etc.

---

## Styling & Theming

- Global styles: `src/styles/global.scss` (imported in main entry)
- Tokens/variables: `_variables.scss`, `_mixins.scss`, etc.
- All component/module-level styles are scoped via `.module.scss`
- **No inline or demo styles permitted.**

---

## UI & Component System

- Only use standardized components for:
    - Forms/fields: `<Input>`, `<Select>`, `<Button>`
    - Layout: `<AppShell>`, `<Sidebar>`, `<Topbar>`
    - Tables/data display: `<Table>`, `<Badge>`, `<Card>`
    - Navigation: `<Link>`
- Business logic (status color, role labels, etc.) and date/number formatting centralized in `src/lib/` utilities.
- All pages must use these shared UI components: NO custom or duplicate markup/logic.

---

## Development Guidelines

- All business/domain logic lives in API or store layers, **not** in page components.
- Keep UI composition logic in page/layout, not state or data transformations.
- Write all new pages/components to consume API/store data directly – no local “sample” data.
- Remove all demo/sample logic before production!
- Use error boundaries, loading states, and guard CLIs for production robustness.
- Commit code only after running lint, typecheck (if using TS), and full build.

---

## License

**Internal or Educational Use Only. Not for production without IT/security review and code audit.**

---

**For backend Python/FastAPI/PostgreSQL integration:**  
Ensure all endpoints and models are aligned with the APIs expected by the frontend. All connectivity, data schema, and security logic should be handled server-side.

---

*This project is production-focused: clean, modular, testable, and ready for real backend integration.*