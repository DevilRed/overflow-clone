import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import questionsReducer from "../slices/questionSlice";
import userReducer from "../slices/userSlice";

// Define the root state type by combining all slice states
export type RootState = ReturnType<typeof rootReducer>;

// Define the AppStore type for the configured store
export type AppStore = ReturnType<typeof setupStore>;

// Define the AppDispatch type for the store's dispatch function
export type AppDispatch = AppStore['dispatch'];

const rootReducer = combineReducers({
  user: userReducer,
  questions: questionsReducer,
});

// config persist, its' like local storage
const persistConfig = {
  key: "root",
  storage,
  // whitelist: ['user'] // optional: specify which reducers to persist
};

// create presisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// setup store function to create the store with preloaded state
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: persistedReducer,
    // to avoid redux-persist error in console
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    preloadedState: preloadedState as any,
  });
}
// create store
const store = setupStore({});

// create persistor
const persistor = persistStore(store);
export { persistor, store };

