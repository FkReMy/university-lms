# University LMS Frontend

A **production-ready React + Vite** frontend for the University Learning Management System. This application serves as the user interface for Students, Professors, Teaching Associates, and Administrators, communicating with the Python FastAPI backend.

It emphasizes performance, modularity, and strict role-based access control.

---

## 🛠 Tech Stack

| Category     | Technology          | Usage                                                                 |
|--------------|---------------------|-----------------------------------------------------------------------|
| **Build Tool**   | Vite                | Fast development server and optimized production builds               |
| **Framework**    | React 18            | Component-based UI with Hooks and Functional Components                |
| **Routing**      | React Router v6     | Client-side routing with protected route guards                       |
| **State**        | Zustand             | Lightweight global state management for auth, UI, and data            |
| **Styling**      | SCSS Modules        | Scoped CSS with global variables and mixins                           |
| **HTTP Client**  | Axios               | API requests with centralized interceptors for JWT authentication     |
| **Realtime**     | Native WebSocket    | Live updates for quizzes, notifications, and other features           |

---

## 📂 Project Structure

The project uses a **domain-driven structure**, keeping global UI components separate from business logic and page views.

```
university-lms-frontend/
├── public/                     # Static assets (favicons, manifests)
└── src/
    ├── assets/                 # Images, fonts, SVGs
    ├── components/             # 🧩 Reusable UI components
    │   ├── common/             # Atomic elements (Button, Input, Card)
    │   ├── layout/             # Structural components (Sidebar, Header)
    │   └── [domain]/           # Feature-specific components (e.g., quizzes/Timer)
    │
    ├── hooks/                  # 🎣 Custom React hooks
    │   ├── useAuth.js
    │   ├── useRoleAccess.js
    │   └── ...
    │
    ├── lib/                    # 🛠 Utilities and helpers
    │   ├── constants.js
    │   ├── formatters.js
    │   └── validators.js
    │
    ├── pages/                  # 📄 Route views (minimal logic)
    │   ├── auth/               # Login, Register
    │   ├── dashboards/         # Role-specific dashboards
    │   └── ...
    │
    ├── router/                 # 🚦 Navigation setup
    │   ├── routes.jsx          # All route definitions
    │   └── guards/             # Role-based route protection components
    │
    ├── services/               # 🔌 Backend communication
    │   ├── api/                # REST API modules (e.g., CourseApi, UserApi)
    │   └── realtime/           # WebSocket handlers
    │
    ├── store/                  # 📦 Zustand global stores
    │   ├── authStore.js
    │   └── ...
    │
    └── styles/                 # 🎨 Global design system
        ├── _variables.scss     # Colors, typography, breakpoints
        └── global.scss         # CSS reset and base styles
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ (recommended)
- npm

### Installation

```bash
cd university-lms-frontend

npm install
```

### Environment Configuration

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

**Required variables in `.env`:**

```
# FastAPI backend API endpoint
VITE_API_BASE_URL=http://localhost:8000/api

# WebSocket endpoint for realtime features
VITE_WS_BASE_URL=ws://localhost:8000/ws
```

### Running the Application

- **Development mode** (hot-reload server, usually at http://localhost:5173):

  ```bash
  npm run dev
  ```

- **Production build** (outputs to `dist/` folder):

  ```bash
  npm run build
  ```

- **Preview production build locally**:

  ```bash
  npm run preview
  ```

---

## 🔐 Architecture Highlights

1. **Role-Based Routing**  
   Access control is enforced at the router level, not inside components.  
   - All routes defined in `src/router/routes.jsx`.  
   - Guard components (`<AdminRoute>`, `<StudentRoute>`, etc.) protect pages and redirect unauthorized users.

2. **Centralized API Layer**  
   No direct `axios` or `fetch` calls in components.  
   - API logic lives in `src/services/api/`.  
   - Example: `CourseApi.getAll()` handles requests, errors, and auth headers automatically.

3. **Global Styling System**  
   SCSS Modules for component-scoped styles + global design tokens.  
   - Tokens defined in `src/styles/_variables.scss`.  
   - Component-specific styles in `.module.scss` files.

---

## 🧪 Development Guidelines

- **Keep pages thin**: `src/pages/` should focus on layout and data fetching. Move complex logic to hooks or stores.
- **Reuse components**: Always use shared components from `src/components/common/` (e.g., `<Input>`, `<Button>`).
- **State management**: Use Zustand for cross-component data (user profile, notifications). Use local `useState` for UI-specific state.
- **Linting**: Run ESLint before committing to ensure code consistency.

---

## 📄 License

Internal or Educational Use Only. This software is intended for academic simulation and requires a secure backend to operate correctly.