/**
 * Application configuration
 *
 * These values control default behaviour across the app. They are intentionally
 * kept in a plain JS file rather than environment variables so that non-technical
 * contributors can adjust them without needing to understand .env files.
 *
 * Future improvement: move user-specific preferences (unit system, week start) into
 * a settings page that writes to localStorage so each user can configure their own
 * experience without touching this file.
 */

const config = {
  /**
   * The unit system to use for weight throughout the app.
   * Accepted values: "metric" (kilograms) or "imperial" (pounds)
   */
  defaultUnitSystem: "metric",

  /**
   * Which day is considered the start of the week when rendering calendars
   * and weekly summary charts.
   * 0 = Sunday, 1 = Monday
   */
  weekStartsOn: 1,

  /**
   * How many weeks of history to show in the progress chart by default.
   * Users can adjust this at runtime using the chart controls.
   */
  defaultChartRange: 8,

  /**
   * Maximum number of sets allowed per exercise in a single workout log entry.
   * Kept as a safeguard against accidental data bloat.
   */
  maxSetsPerExercise: 20,

  /**
   * The localStorage key under which all workout data is stored.
   * Changing this after launch will cause existing users to lose their data,
   * so treat it as permanent once the app is in production.
   */
  storageKey: "fittrack_workouts",

  /**
   * Predefined muscle groups shown in the exercise picker.
   * Add or remove entries here to adjust what appears in the UI.
   * Each entry is used both as a display label and as a data tag.
   */
  muscleGroups: [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Legs",
    "Glutes",
    "Core",
    "Cardio",
    "Full Body",
  ],

  /**
   * Default rest timer duration in seconds shown between sets.
   * Future improvement: make this configurable per-exercise type.
   */
  defaultRestSeconds: 90,
};

export default config;
