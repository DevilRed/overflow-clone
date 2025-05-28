import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import questionsReducer from "../slices/questionSlice";

export function setupTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      user: userReducer,
      questions: questionsReducer,
    },
    preloadedState,
  });
}
