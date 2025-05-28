import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../tests/test-util";
import App from "./App";

describe("App", () => {
  it("should render ok", () => {
    renderWithProviders(<App />);
    expect(screen.getByText("React Stack")).toBeInTheDocument();
  });
});
