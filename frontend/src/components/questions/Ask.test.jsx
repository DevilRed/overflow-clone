import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { renderWithProviders } from "../../../tests/test-util";
import { Ask } from "./Ask";

// Mocks
vi.mock("axios");
vi.mock("react-toastify");
/* jest.mock("../../helpers/getEnvironments", () => ({
  getEnvironments: () => ({ VITE_BASE_URL: "http://test.com" }),
})); */

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
// mock store
const renderWithRouter = (preloadedState = {}) => {
  return renderWithProviders(
    <BrowserRouter>
      <Ask />
    </BrowserRouter>
  );
};
// mock react-quill
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

describe("Ask Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login if user is not logged in", () => {
    renderWithRouter({
      user: { isLoggedIn: false, token: null },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders form elements correctly", () => {
    renderWithRouter({
      user: { isLoggedIn: true, token: "test-token" },
    });

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/body/i)).toBeInTheDocument();
    expect(screen.getByText(/tags/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Question created successfully" },
    });

    renderWithRouter({
      user: { isLoggedIn: true, token: "test-token" },
    });

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: "Test Question" } });

    // Set body content using mocked ReactQuill
    const bodyInput = screen.getByLabelText(/body/i);
    fireEvent.change(bodyInput, { target: { value: "Test Question Body" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/question/store"),
        expect.objectContaining({
          title: "Test Question",
          body: "Test Question Body",
          tags: [],
        }),
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Question created successfully"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("prevents submission when required fields are empty", async () => {
    // Mock the API to return validation errors, not required since I added frontend validation
    /* axios.post.mockRejectedValueOnce({
      response: {
        status: 422,
        data: {
          errors: {
            title: ["The title field is required"],
            body: ["The body field is required"],
          },
        },
      },
    }); */
    renderWithRouter({
      user: { isLoggedIn: true, token: "test-token" },
    });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Verify API was called with empty fields, expect required if API call is done
      /* expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/question/store"),
        {
          title: "",
          body: "",
          tags: [],
        },
        expect.any(Object)
      ); */
      // frontend validation added
      expect(axios.post).not.toHaveBeenCalled();

      // Verify error messages are displayed
      expect(
        screen.getByText("The title field is required")
      ).toBeInTheDocument();
      expect(
        screen.getByText("The body field is required")
      ).toBeInTheDocument();
    });
  });

  it("handles validation errors", async () => {
    // mock backend response, if API would have been done
    /* const validationErrors = {
      response: {
        status: 422,
        data: {
          errors: {
            title: ["Title is required"],
            body: ["Body is required"],
          },
        },
      },
    };

    axios.post.mockRejectedValueOnce(validationErrors); */

    renderWithRouter({
      user: { isLoggedIn: true, token: "test-token" },
    });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();

      // Verify error messages are displayed
      expect(
        screen.getByText("The title field is required")
      ).toBeInTheDocument();
      expect(
        screen.getByText("The body field is required")
      ).toBeInTheDocument();
    });
  });
});
