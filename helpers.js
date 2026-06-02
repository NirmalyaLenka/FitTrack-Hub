/**
 * helpers.js
 *
 * Pure utility functions used across the app for formatting, calculation, and
 * data transformation. Every function here is side-effect free and independently
 * testable.
 */

import { format, formatDistanceToNow, startOfWeek, eachDayOfInterval, subWeeks } from "date-fns";
import config from "../config";

/**
 * Formats a date string or Date object into a human-readable label.
 * Used in workout history cards and the log header.
 *
 * @param {string|Date} date
 * @param {string} [pattern="dd MMM yyyy"] - date-fns format string
 * @returns {string}
 */
export function formatDate(date, pattern = "dd MMM yyyy") {
  return format(new Date(date), pattern);
}

/**
 * Returns a relative time string like "3 days ago" or "about 2 hours ago".
 * Used in the recent workouts list to give a quick sense of recency.
 *
 * @param {string|Date} date
 * @returns {string}
 */
export function timeAgo(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Generates a cryptographically-simple unique ID for new workout entries.
 * Good enough for client-side use. When a backend is added, IDs should come
 * from the server instead.
 *
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Calculates the total volume (sets x reps x weight) for a single workout.
 * Volume is a common proxy for training load and is displayed on summary cards.
 *
 * @param {Array} exercises - Array of exercise objects with sets array
 * @returns {number} Total volume, rounded to the nearest integer
 */
export function calculateVolume(exercises) {
  if (!Array.isArray(exercises)) return 0;
  return Math.round(
    exercises.reduce((total, exercise) => {
      if (!Array.isArray(exercise.sets)) return total;
      return (
        total +
        exercise.sets.reduce((setTotal, set) => {
          const weight = parseFloat(set.weight) || 0;
          const reps = parseInt(set.reps, 10) || 0;
          return setTotal + weight * reps;
        }, 0)
      );
    }, 0)
  );
}

/**
 * Groups a flat array of workouts by ISO week string (e.g. "2025-W03").
 * Used to build the weekly summary chart and calculate weekly totals.
 *
 * @param {Array} workouts
 * @returns {Object} Keys are week strings, values are arrays of workouts
 */
export function groupByWeek(workouts) {
  return workouts.reduce((acc, workout) => {
    const weekKey = format(
      startOfWeek(new Date(workout.date), { weekStartsOn: config.weekStartsOn }),
      "yyyy-'W'ww"
    );
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(workout);
    return acc;
  }, {});
}

/**
 * Builds the data array expected by Recharts for the weekly volume chart.
 * Returns one entry per week for the past `weeks` weeks, filling in zero
 * for weeks with no workouts so the chart line stays continuous.
 *
 * @param {Array} workouts
 * @param {number} [weeks=config.defaultChartRange]
 * @returns {Array} [{ weekLabel: string, volume: number, count: number }]
 */
export function buildVolumeChartData(workouts, weeks = config.defaultChartRange) {
  const grouped = groupByWeek(workouts);
  const now = new Date();

  return Array.from({ length: weeks }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(now, weeks - 1 - i), {
      weekStartsOn: config.weekStartsOn,
    });
    const key = format(weekStart, "yyyy-'W'ww");
    const weekWorkouts = grouped[key] || [];

    return {
      weekLabel: format(weekStart, "MMM d"),
      volume: weekWorkouts.reduce((sum, w) => sum + calculateVolume(w.exercises), 0),
      count: weekWorkouts.length,
    };
  });
}

/**
 * Calculates the current consecutive-day workout streak.
 * A streak counts the number of calendar days ending today (or yesterday,
 * if the user has not yet logged today) on which at least one workout exists.
 *
 * @param {Array} workouts - Full sorted workout list
 * @returns {number} streak length in days
 */
export function calculateStreak(workouts) {
  if (!workouts.length) return 0;

  const loggedDays = new Set(
    workouts.map((w) => format(new Date(w.date), "yyyy-MM-dd"))
  );

  let streak = 0;
  let cursor = new Date();

  // Allow streak to continue if the user has not logged today yet
  if (!loggedDays.has(format(cursor, "yyyy-MM-dd"))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (loggedDays.has(format(cursor, "yyyy-MM-dd"))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/**
 * Finds the personal best (highest weight used) for a given exercise name.
 *
 * Future improvement: also track the date the PR was set so it can be
 * displayed alongside the weight on the exercise history page.
 *
 * @param {Array} workouts
 * @param {string} exerciseName - Case-insensitive exercise name to search for
 * @returns {number|null} Best weight, or null if the exercise has no records
 */
export function getPersonalBest(workouts, exerciseName) {
  let best = null;
  const name = exerciseName.toLowerCase();

  for (const workout of workouts) {
    for (const exercise of workout.exercises || []) {
      if (exercise.name.toLowerCase() !== name) continue;
      for (const set of exercise.sets || []) {
        const weight = parseFloat(set.weight);
        if (!isNaN(weight) && (best === null || weight > best)) {
          best = weight;
        }
      }
    }
  }

  return best;
}

/**
 * Converts a weight value between unit systems.
 *
 * @param {number} value
 * @param {"metric"|"imperial"} from
 * @param {"metric"|"imperial"} to
 * @returns {number} Converted value rounded to one decimal place
 */
export function convertWeight(value, from, to) {
  if (from === to) return value;
  if (from === "metric" && to === "imperial") return Math.round(value * 2.2046 * 10) / 10;
  if (from === "imperial" && to === "metric") return Math.round((value / 2.2046) * 10) / 10;
  return value;
}
