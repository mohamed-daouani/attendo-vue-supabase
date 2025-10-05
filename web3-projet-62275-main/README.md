# Attendo – Vue.js Attendance Management App (Supabase)

**Attendo** is a modern attendance management application built with **Vue.js 3** and connected to **Supabase** for real-time data handling, authentication, and cloud storage.  
Developed as part of the **4WEB3** course at **Haute École Bruxelles-Brabant (HE2B ESI)**, this project demonstrates component-based front-end development and seamless integration with a backend-as-a-service platform.

![Vue.js](https://img.shields.io/badge/Vue.js-42b883?style=flat&logo=vuedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## Project Overview
- **Course:** 4WEB3 – Web Application Development  
- **Institution:** HE2B ESI (Haute École Bruxelles-Brabant)  
- **Author:** Mohamed Daouani (g62275)  
- **Framework:** Vue.js 3 + Vite  
- **Database:** Supabase (PostgreSQL, Auth, Storage)  
- **Styling:** TailwindCSS  
- **Deployment:** Render / Netlify  

---

## Objectives
The project was designed to:
- Build a **fully client-side web application** using **Vue.js 3** and the **Composition API**.  
- Implement **real-time data persistence** with **Supabase**.  
- Enable **secure user authentication** (sign-up, sign-in, and logout).  
- Apply **responsive design principles** using **TailwindCSS**.  
- Manage attendance data efficiently with **live updates**.  

---

## Features
- Authentication (Sign Up / Login) via Supabase Auth  
- Attendance list management  
- Real-time data updates (insert, update, delete)  
- Filtering and sorting by date, class, or user  
- Responsive layout optimized for mobile and desktop  
- Environment variables for secure API integration  

---

## Architecture Overview
The project follows a clean and modular structure:

```
src/
├── assets/
├── components/
│   ├── AttendanceTable.vue
│   ├── LoginForm.vue
│   └── Navbar.vue
├── composables/
│   ├── useSupabase.js
│   └── useAuth.js
├── views/
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   └── NotFoundView.vue
├── router/
│   └── index.js
├── store/
│   └── attendance.js
├── App.vue
└── main.js
```

The application uses:
- **Pinia** for state management  
- **Vue Router** for navigation  
- **Vite** for fast bundling and hot-reload  

---

## Installation & Setup

### Prerequisites
- Node.js 18+  
- npm or yarn  
- A Supabase account (https://supabase.com)  

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/mohameddaouani/attendo-vue-supabase.git
   cd attendo-vue-supabase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file at the root with your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser:
   ```
   http://localhost:5173
   ```

---

## Supabase Configuration

In your Supabase project:
- Create a **table** named `attendance` with columns:
  | id | student_name | date | status |
  |----|---------------|------|--------|
  | int8 (PK) | text | date | boolean |

- Enable **Row Level Security (RLS)** and create policies for authenticated users.  
- Activate **Auth → Email login**.  
- Use **Storage** for optional file uploads (e.g., student avatars).  


## Author
**Mohamed Daouani**  
Haute École Bruxelles-Brabant – ESI  
Course: 4WEB3 – Web Application Development  
GitHub: [mohameddaouani](https://github.com/mohameddaouani)

---

> © 2025 – Attendo, developed by Mohamed Daouani for the 4WEB3 course at HE2B ESI.
