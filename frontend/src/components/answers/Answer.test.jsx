import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-util";
import { Answer } from "./Answer";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

vi.mock("html-to-react", () => ({
  Parser: () => ({
    parse: (html) => html,
  }),
}));

vi.mock("axios");
vi.mock("react-toastify");

// mock data
const mockAnswer = {
  id: 1,
  body: "Test answer body",
  score: 5,
  created_at: "2 days ago",
  best_answer: false,
  user: {
    id: 2,
    name: "Jane Doe",
    image: "test-image.jpg",
  },
};

const mockQuestion = {
  id: 1,
  user: {
    id: 1,
  },
};

const renderAnswerWithRouter = (preloadedState = {}) => {
  return renderWithProviders(
    <BrowserRouter>
      <Answer answer={mockAnswer} question={mockQuestion} />
    </BrowserRouter>,
    { preloadedState }
  );
};

describe("Answer component", () => {
  it("should render answer data correctly", () => {
    renderAnswerWithRouter({
      user: { isLoggedIn: false, token: null },
    });
    expect(screen.getByText("Test answer body")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Asked 2 days ago")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByAltText("user image")).toHaveAttribute(
      "src",
      "test-image.jpg"
    );
  });

  it("shows login links when user is not logged in", () => {
    renderAnswerWithRouter({
      user: { isLoggedIn: false, token: null },
    });

    const voteLinks = screen.getAllByRole("link", { name: "" });
    expect(voteLinks).toHaveLength(2);
    voteLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/login");
    });
  });

  it("shows vote buttons when user is logged in", () => {
    renderAnswerWithRouter({
      user: { isLoggedIn: true, token: "test-token", user: { id: 2 } },
    });

    const upvoteButton = screen.getByTestId("answer-vote-up");
    const downvoteButton = screen.getByTestId("answer-vote-down");

    expect(upvoteButton).toBeInTheDocument();
    expect(downvoteButton).toBeInTheDocument();
  });

  it('should "Mark as best answer" button when user is question owner', () => {
    renderAnswerWithRouter({
      user: { isLoggedIn: true, token: "test-token", user: { id: 1 } },
    });
    const bestAnswerButton = screen.getByText("Mark as best answer");
    expect(bestAnswerButton).toBeInTheDocument();
  });

  it('does not show "Mark as best answer" button when answer is already best answer', () => {
    const answerwithBest = { ...mockAnswer, best_answer: true };
    renderWithProviders(
      <BrowserRouter>
        <Answer answer={answerwithBest} question={mockQuestion} />
      </BrowserRouter>,
      {
        preloadedState: {
          user: {
            isLoggedIn: true,
            token: "test-token",
            user: { id: 1 },
          },
        },
      }
    );

    expect(screen.queryByText("Mark as best answer")).not.toBeInTheDocument();
  });

  it('does not show "Mark as best answer button" when user is not question owner', () => {
    renderAnswerWithRouter({
      user: {
        isLoggedIn: true,
        token: "test-token",
        user: { id: 999 },
      },
    });
    expect(screen.queryByText("Mark as best answer")).not.toBeInTheDocument();
  });

  it("handles upvote correctly when logged in", async () => {
    axios.put.mockResolvedValueOnce({
      data: { message: "Upvoted successfully" },
    });
    renderAnswerWithRouter({
      user: { isLoggedIn: true, token: "test-token", user: { id: 2 } },
    });
    const upvoteButton = screen.getByTestId("answer-vote-up");
    fireEvent.click(upvoteButton);
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining(`/api/vote/${mockAnswer.id}/up/answer`),
        null,
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith("Upvoted successfully");
    });
  });
  it("mark answer as best if user is question owner", async () => {
    axios.put.mockResolvedValueOnce({
      data: { message: "Marked as best successfully" },
    });
    renderAnswerWithRouter({
      user: { isLoggedIn: true, token: "test-token", user: { id: 1 } },
    });
    const markButton = screen.getByTestId("btn-mark-as-best");
    fireEvent.click(markButton);
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining(`/api/mark/${mockAnswer.id}/best`),
        null,
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith("Marked as best successfully");
    });
  });
  it("should show an icon if answer is marked as best", () => {
    mockAnswer.best_answer = true;
    const container = renderWithProviders(
      <BrowserRouter>
        <Answer answer={mockAnswer} question={mockQuestion} />
      </BrowserRouter>
    );
    expect(screen.getByTestId("best-answer-icon")).toBeInTheDocument();
  });
});
