import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { setupTestStore } from "../src/redux/store/storeTest";
import { MemoryRouter } from "react-router-dom";

export function renderWithProviders(ui, extendedRenderOptions = {}) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupTestStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
export const renderWithRouter = (ui, options) => {
  const {
    preloadedState = {},
    store = setupTestStore(preloadedState),
    ...renderOptions
  } = options;
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
  return {
    ...render(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
  };
};