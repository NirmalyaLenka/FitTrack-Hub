/**
 * App.jsx
 *
 * Root component. Wraps the entire tree in the WorkoutProvider so that any
 * page or component can access workout data via useWorkouts(). Handles
 * top-level routing.
 *
 * Route structure:
 *   /              Dashboard with summary stats and recent workouts
 *   /log           Log a new workout
 *   /history       Full workout history with search and filter
 *   /progress      Charts and personal bests
 *   /settings      Unit preferences, data export and import, clear data
 *
 * Future improvement: add a /workout/:id route for a dedicated workout
 * detail page so users can review and edit past sessions inline.
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WorkoutProvider } from "./context/WorkoutContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LogWorkout from "./pages/LogWorkout";
import History from "./pages/History";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import "./styles/globals.css";

export default function App() {
  return (
    <WorkoutProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<LogWorkout />} />
            <Route path="/history" element={<History />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
            {/* Catch-all redirects unknown paths to the dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WorkoutProvider>
  );
}
