import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import { EditAnswer } from "./EditAnswer";
import {
  renderWithProviders,
  renderWithRouter,
} from "../../../tests/test-util";

vi.mock("axios");
vi.mock("react-quill", () => ({
  __esModule: true,
  default: ({ value, onChange }) => (
    <div data-testid="quill-editor">
      <textarea
        data-testid="quill-textarea"
        aria-label="body"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

const renderComponent = (preloadedState = {}) => {
  return renderWithProviders(
    <MemoryRouter initialEntries={["/edit-answer/123"]}>
      <Routes>
        <Route path="/edit-answer/:id" element={<EditAnswer />} />
      </Routes>
    </MemoryRouter>,
    { preloadedState }
  );
};

describe("Edit answer component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          body: "This is the test answer",
          question: { slug: "test-question" },
        },
      },
    });

    axios.put.mockResolvedValue({
      data: { message: "answer updated successfully" },
    });
  });

  it("redirects to login if user is not logged in", () => {
    renderComponent({ user: { isLoggedIn: false } });
    expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
  });

  it("shows loading spinner while fetching the answer", async () => {
    renderComponent({ user: { isLoggedIn: true, token: "fake-token" } });
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders answer after fetching data", async () => {
    renderWithRouter(<EditAnswer />, {
      user: { isLoggedIn: true, token: "fake-token" },
    });

    await waitFor(() =>
      expect(screen.getByTestId("answer-form")).toBeInTheDocument()
    );
    expect(screen.getByText("Edit your answer")).toBeInTheDocument();
  });

  it("submits form and redirects after updating answer", async () => {
    renderWithRouter(<EditAnswer />, {
      user: { isLoggedIn: true, token: "fake-token" },
    });

    await waitFor(() =>
      expect(screen.getByTestId("answer-form")).toBeInTheDocument()
    );
    const editor = screen.getByLabelText(/body/i);
    fireEvent.change(editor, { target: { value: "text sample" } });

    fireEvent.submit(screen.getByTestId("answer-form"));

    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
  });
  it("displays validation error when submitting empty answer", async () => {
    renderWithRouter(<EditAnswer />, {
      user: { isLoggedIn: true, token: "fake-token" },
    });

    await waitFor(() =>
      expect(screen.getByTestId("answer-form")).toBeInTheDocument()
    );
    const editor = screen.getByLabelText(/body/i);
    fireEvent.change(editor, { target: { value: "" } });

    fireEvent.submit(screen.getByTestId("answer-form"));

    expect(
      await screen.findByText("The body field is required")
    ).toBeInTheDocument();
  });
});
