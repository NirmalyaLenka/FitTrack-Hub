/**
 * WorkoutContext.js
 *
 * Provides workout data and mutation functions to the entire component tree
 * via React Context. This avoids prop-drilling and keeps data-fetching logic
 * in one place.
 *
 * Why Context rather than a library like Redux or Zustand?
 * The data model is simple: one flat list of workouts. Context is sufficient
 * and adds no dependencies. If the app grows to need cross-cutting concerns
 * like optimistic updates or server-side caching, migrating to React Query
 * or Zustand from here is straightforward because consumers only use the
 * hook, not the context directly.
 *
 * Future improvement: when a backend API lands, the load/save calls in this
 * file are the only things that change. Everything that imports useWorkouts()
 * stays the same.
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { loadWorkouts, saveWorkouts } from "../utils/storage";
import { generateId } from "../utils/helpers";

const WorkoutContext = createContext(null);

// ---------------------------------------------------------------------------
// Reducer — all state changes go through here so behaviour is predictable
// and easy to trace in React DevTools.
// ---------------------------------------------------------------------------

function workoutReducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return { ...state, workouts: action.payload, loaded: true };

    case "ADD_WORKOUT": {
      const updated = [action.payload, ...state.workouts];
      saveWorkouts(updated);
      return { ...state, workouts: updated };
    }

    case "UPDATE_WORKOUT": {
      const updated = state.workouts.map((w) =>
        w.id === action.payload.id ? action.payload : w
      );
      saveWorkouts(updated);
      return { ...state, workouts: updated };
    }

    case "DELETE_WORKOUT": {
      const updated = state.workouts.filter((w) => w.id !== action.payload);
      saveWorkouts(updated);
      return { ...state, workouts: updated };
    }

    case "CLEAR_ALL":
      saveWorkouts([]);
      return { ...state, workouts: [] };

    default:
      return state;
  }
}

const initialState = {
  workouts: [],
  loaded: false,
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  // Load from storage on first mount
  useEffect(() => {
    const workouts = loadWorkouts();
    dispatch({ type: "LOAD", payload: workouts });
  }, []);

  const addWorkout = useCallback((workoutData) => {
    const workout = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...workoutData,
    };
    dispatch({ type: "ADD_WORKOUT", payload: workout });
    return workout;
  }, []);

  const updateWorkout = useCallback((workout) => {
    dispatch({ type: "UPDATE_WORKOUT", payload: workout });
  }, []);

  const deleteWorkout = useCallback((id) => {
    dispatch({ type: "DELETE_WORKOUT", payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  const value = {
    workouts: state.workouts,
    loaded: state.loaded,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    clearAll,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

// ---------------------------------------------------------------------------
// Consumer hook — the only way components should access workout state
// ---------------------------------------------------------------------------

/**
 * Returns workout state and mutation functions.
 *
 * @returns {{
 *   workouts: Array,
 *   loaded: boolean,
 *   addWorkout: Function,
 *   updateWorkout: Function,
 *   deleteWorkout: Function,
 *   clearAll: Function
 * }}
 */
export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkouts must be used inside a WorkoutProvider");
  }
  return context;
}
