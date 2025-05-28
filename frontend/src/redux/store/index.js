import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import userReducer from "../slices/userSlice";
import questionsReducer from "../slices/questionSlice";

const rootReducer = combineReducers({
  user: userReducer,
  questions: questionsReducer,
});

// config persist, its' like local storage
const persistConfig = {
  key: "root",
  storage,
};

// create presisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export function setupStore(preloadedState) {
  return configureStore({
    reducer: persistedReducer,
    // to avoid redux-persist error in console
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    preloadedState,
  });
}
// create store
const store = setupStore({});

// create persistor
const persistor = persistStore(store);
export { store, persistor };
