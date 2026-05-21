# AI Student Impact - Interactive Dashboard

A modern, responsive, and interactive web dashboard built to visualize the impact of Generative AI usage on student academic performance. This application serves as the frontend presentation layer, fetching real-time data from a dimensional data warehouse hosted on Supabase (PostgreSQL).

---

# Project Overview

This project seamlessly bridges Data Engineering and Frontend Web Development. It pulls cleaned and modeled data (Star Schema) via Supabase API and transforms raw metrics into actionable insights using declarative React components and interactive charts.

## Key Features

- **Real-Time Data Fetching:** Utilizes React Hooks (`useEffect`, `useState`) to dynamically fetch and calculate aggregated data directly from the Supabase cloud database.
- **KPI Tracking:** Top-level metrics cards calculating total samples, average AI usage hours, and average post-AI GPA.
- **Interactive Visualizations:** - **Pie Chart:** Displays the distribution of Burnout Risk Levels among students.
  - **Bar Chart:** Compares the average Pre-Semester vs. Post-Semester GPA grouped by their respective risk levels.
- **Live Data Table:** A flexing component showing the top 5 raw data samples to prove data integrity and real-time backend connection.
- **Responsive UI:** Fully styled using Tailwind CSS, ensuring a clean and professional look across both desktop and mobile screens.

---

# Tech Stack

### Frontend Core
- **React.js** (Bootstrapped with **Vite** for blazing-fast development)
- **Tailwind CSS** (Utility-first styling & layouting)

### Data Visualization & Icons
- **Recharts** (Composable, declarative charting library for React)
- **Lucide-React** (Clean and consistent SVG icons)

### Backend / BaaS
- **Supabase** (PostgreSQL database & API client)
- **@supabase/supabase-js** (Data fetching and client connection)

---

# Architecture & Logic

The dashboard implements client-side data aggregation to reduce database load. Upon fetching the `fact_student_ai_impact` table, the React application uses JavaScript `reduce()` methods to:
1. Group students by their `risk_id`.
2. Handle null/undefined values intelligently (preventing "Unknown" errors from valid `0` IDs).
3. Calculate accurate averages for GPA comparisons before passing the formatted arrays to Recharts.

---

# Installation & Setup

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/ai-impact-dashboard.git](https://github.com/your-username/ai-impact-dashboard.git)
   cd ai-impact-dashboard
```

2. **Install dependencies:**
```bash
npm install

```


3. **Set up environment variables:**
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```


4. **Run the development server:**
```bash
npm run dev

```


Open `http://localhost:5173` to view it in the browser.

---

# Future Improvements

* Add loading skeletons for a smoother user experience during data fetching.
* Implement filtering options (e.g., filter by specific AI Policy or Study Major).
* Add subtle entrance animations using GSAP for a premium feel.

---

# Author

Nugraha Adiputra
