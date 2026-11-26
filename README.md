# 🎓 Online Learning Platform

A responsive, modern online learning platform built with **React**, **Vite**, and **Tailwind CSS**, featuring a public course catalog, a **Student Learning Portal**, and an **Instructor & Admin Studio**.

- **Live Demo:** [https://online-learning-platform-two-rho.vercel.app](https://online-learning-platform-two-rho.vercel.app)

- **GitHub Repository:** [https://github.com/RohitKudtarkar/online-learning-platform.git](https://github.com/RohitKudtarkar/online-learning-platform.git)

---

## ✨ Key Features

### 🌐 Public Experience
- **Landing & Informational Pages:** Hero showcase, How It Works guide, About page, and Contact page.
- **Course Catalog & Details:** Filterable and searchable course exploration (`ExploreCourses`) with detailed syllabus previews, ratings, pricing, and learner reviews.
- **Authentication Flows:** Dedicated Login, Signup, and Forgot Password screens with role-based access control (`ProtectedRoute`).

### 📚 Student Learning Portal
- **Dashboard & My Learning:** Track enrolled courses, active progress bars, and quick-resume lesson links.
- **Interactive Course Player:** Watch modules, mark lessons complete, and progress through structured curricula.
- **Assessments & Credentials:** Submit course assignments (`Assignments`), take interactive quizzes (`Quizzes`), and earn downloadable/viewable completion certificates (`Certificates`).
- **Personalization:** Save courses to a wishlist, manage profile settings, view notifications, and toggle light/dark mode (`ThemeContext`).

### 🛠️ Instructor & Admin Studio
- **Studio Overview (`AdminDashboard`):** Real-time KPI summary cards covering published courses, curriculum lessons, active enrollments, submissions, and catalog distribution.
- **Course Creation & Editing (`CourseEditor` & `ManageCourses`):** Build new courses with structured modules and lessons, quick-edit course metadata, upload thumbnails, and manage catalog visibility.
- **Learner Roster (`ManageStudents`):** Monitor enrolled students, inspect course-by-course progress bars, and check quiz, assignment, and certificate status.

---

## 🧰 Tech Stack

- **Frontend:** React, JavaScript (ES6+), React Router
- **Styling:** Tailwind CSS, Lucide Icons
- **State Management:** React Context API (`AuthContext`, `PlatformContext`, `ThemeContext`, `ToastContext`) with `localStorage` persistence
- **Build Tool:** Vite
- **Deployment:** Vercel (with `vercel.json` SPA routing rewrites)

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/RohitKudtarkar/online-learning-platform.git](https://github.com/RohitKudtarkar/online-learning-platform.git)
   cd online-learning-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Create a production build:**
   ```bash
   npm run build
   ```

5. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```text
online-learning-platform/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── FilterDropdown.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── LearnerReviews.jsx
│   │   │   └── Modal.jsx
│   │   └── layouts/
│   │       ├── AdminLayout.jsx
│   │       ├── PublicLayout.jsx
│   │       └── StudentLayout.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── PlatformContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── ToastContext.jsx
│   ├── data/
│   │   └── seedData.js
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CourseEditor.jsx
│   │   │   ├── ManageCourses.jsx
│   │   │   └── ManageStudents.jsx
│   │   ├── public/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── CourseDetails.jsx
│   │   │   ├── ExploreCourses.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   └── student/
│   │       ├── Assignments.jsx
│   │       ├── Certificates.jsx
│   │       ├── CoursePlayer.jsx
│   │       ├── Dashboard.jsx
│   │       ├── MyLearning.jsx
│   │       ├── MyProgress.jsx
│   │       ├── Notifications.jsx
│   │       ├── ProfileSettings.jsx
│   │       ├── Quizzes.jsx
│   │       └── Wishlist.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── utils/
│   │   ├── userStorage.js
│   │   └── validation.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## 🌐 Deployment

This project is deployed on **Vercel** with a root `vercel.json` rewrite rule so direct navigation and browser refreshes on nested client-side routes (such as `/student/my-learning` and `/admin/courses`) resolve cleanly without `404` errors:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```