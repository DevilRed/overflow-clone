import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-util";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AddAnswer } from "./AddAnswer";

vi.mock("axios");
vi.mock("react-toastify", () => ({ toast: { success: vi.fn() } }));
const mockDispatch = vi.fn();

vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: vi.fn(),
  };
});

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

const mockState = {
  questions: {
    loading: false,
    question: {
      title: "Test Question",
      body: "Test question body",
      slug: "test-question",
      score: 10,
      viewCount: 100,
      answerCount: "2 Answers",
      created_at: "2 days ago",
      tags: ["react", "javascript"],
      user: {
        id: 1,
        name: "John Doe",
        image: "test-image.jpg",
      },
      answers: [
        {
          id: 1,
          body: "Test answer",
          user: { name: "Jane Doe" },
        },
      ],
    },
    error: null,
  },
  user: {
    isLoggedIn: true,
    token: "abc",
  },
};

describe("AddAnswer component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSelector).mockImplementation((selector) =>
      selector(mockState)
    );
  });

  it("should render add form", async () => {
    renderWithProviders(<AddAnswer />);

    expect(screen.queryByText(/Add your answer/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });
  });

  it("should submit the answer form successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Answer created successfully" },
    });

    renderWithProviders(<AddAnswer />);

    const bodyInput = screen.getByLabelText(/body/i);
    fireEvent.change(bodyInput, { target: { value: "text sample" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api/answer/${mockState.questions.question.slug}/store`
        ),
        expect.objectContaining({
          body: "text sample",
        }),
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith("Answer created successfully");
    });
  });

  it("should show frontend validation error when submitting empty form", async () => {
    renderWithProviders(<AddAnswer />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Verify frontend validation error
      expect(
        screen.getByText(/The body field is required/i)
      ).toBeInTheDocument();

      // Ensure NO API call was made
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
