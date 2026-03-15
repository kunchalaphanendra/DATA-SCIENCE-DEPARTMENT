# DATA SCIENCE DEPARTMENT PORTAL

Welcome to the official portal for the Data Science Department. This application serves as a central hub for students, faculty, and administration.

## Features

- **Public Information:** Access department notices, events, student achievements, and placement statistics quickly.
- **Faculty Profiles:** Browse our distinguished faculty members, their qualifications, and expertise.
- **Department Gallery:** View snapshots across various college events, hackathons, and activities.
- **Admin Dashboard:** A secured portal for administration to easily update notices, events, achievements, and other department assets dynamically.

## Tech Stack

This portal is built using modern web development practices:

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **Routing:** React Router
- **Backend / Database:** Supabase (PostgreSQL, Auth, Storage)

## Running the Application Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kunchalaphanendra/DATA-SCIENCE-DEPARTMENT.git
   cd "DATA-SCIENCE-DEPARTMENT"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials. Do not commit this file.
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:5173`.
