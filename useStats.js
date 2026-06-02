/**
 * useStats.js
 *
 * Derives summary statistics from the workout list. Keeping this logic in
 * a hook rather than components means the same numbers can be displayed in
 * multiple places (dashboard cards, the profile page, share images) without
 * duplication.
 *
 * All calculations are memoised with useMemo so they only recompute when the
 * workout list actually changes, not on every render.
 *
 * Future improvement: add a `range` parameter (7d, 30d, 90d, all-time) so
 * dashboard cards can show period-scoped numbers without fetching differently.
 */

import { useMemo } from "react";
import { useWorkouts } from "../context/WorkoutContext";
import {
  calculateStreak,
  calculateVolume,
  buildVolumeChartData,
  getPersonalBest,
} from "../utils/helpers";
import config from "../config";

/**
 * @returns {{
 *   totalWorkouts: number,
 *   currentStreak: number,
 *   thisWeekCount: number,
 *   totalVolume: number,
 *   chartData: Array,
 *   getExercisePR: (name: string) => number|null
 * }}
 */
export function useStats() {
  const { workouts } = useWorkouts();

  const totalWorkouts = workouts.length;

  const currentStreak = useMemo(() => calculateStreak(workouts), [workouts]);

  const thisWeekCount = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workouts.filter((w) => new Date(w.date) >= weekAgo).length;
  }, [workouts]);

  const totalVolume = useMemo(
    () => workouts.reduce((sum, w) => sum + calculateVolume(w.exercises), 0),
    [workouts]
  );

  const chartData = useMemo(
    () => buildVolumeChartData(workouts, config.defaultChartRange),
    [workouts]
  );

  const getExercisePR = (name) => getPersonalBest(workouts, name);

  return {
    totalWorkouts,
    currentStreak,
    thisWeekCount,
    totalVolume,
    chartData,
    getExercisePR,
  };
}
