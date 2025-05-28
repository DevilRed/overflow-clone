import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Question } from "./Question";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { configureStore } from "@reduxjs/toolkit";

// Mock dependencies
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ slug: "test-question" }),
  };
});

vi.mock("axios");
vi.mock("react-toastify");
vi.mock("html-to-react", () => ({
  Parser: () => ({
    parse: (html) => html,
  }),
}));

vi.mock("./AddAnswer", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: () => <div data-testid="add-answer-form">add form</div>,
  };
});

// Mock question data
const mockQuestion = {
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
};

// Create a mock store using configureStore
const createTestStore = (initialState) => {
  return configureStore({
    reducer: {
      questions: (state = initialState.questions) => state,
      user: (state = initialState.user) => state,
    },
    preloadedState: initialState,
  });
};

// Test wrapper component
const TestWrapper = ({ children, store }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("Question Component", () => {
  let store;

  beforeEach(() => {
    store = createTestStore({
      questions: {
        question: mockQuestion,
        loading: false,
        error: null,
      },
      user: {
        isLoggedIn: true,
        token: "test-token",
        user: {
          id: 1,
          name: "John Doe",
          image: "test-image.jpg",
        },
      },
    });
  });

  it("renders loading spinner when loading", () => {
    store = createTestStore({
      questions: { loading: true, question: null, error: null },
      user: { isLoggedIn: false, token: null },
    });

    render(
      <TestWrapper store={store}>
        <Question />
      </TestWrapper>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    store = createTestStore({
      questions: { loading: false, question: null, error: "Test error" },
      user: { isLoggedIn: false, token: null },
    });

    render(
      <TestWrapper store={store}>
        <Question />
      </TestWrapper>
    );

    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("renders question details correctly", () => {
    render(
      <TestWrapper store={store}>
        <Question />
      </TestWrapper>
    );
    // screen.debug();

    expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.user.name)).toBeInTheDocument();
    expect(
      screen.getByText("Asked " + mockQuestion.created_at)
    ).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.score.toString())).toBeInTheDocument();
    mockQuestion.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("handles upvote correctly when logged in", async () => {
    axios.put.mockResolvedValueOnce({
      data: { message: "Upvoted successfully" },
    });

    render(
      <TestWrapper store={store}>
        <Question />
      </TestWrapper>
    );

    const upvoteButton = screen.getByTestId("vote-up-button");
    fireEvent.click(upvoteButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining("/api/vote/test-question/up/question"),
        null,
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith("Upvoted successfully");
    });
  });

  it("redirects to login when voting while not logged in", async () => {
    store = createTestStore({
      questions: { question: mockQuestion, loading: false, error: null },
      user: { isLoggedIn: false, token: null },
    });

    render(
      <TestWrapper store={store}>
        <Question />
      </TestWrapper>
    );

    const upvoteButton = screen.getByTestId("vote-up-button");
    expect(upvoteButton.closest("a")).toHaveAttribute("href", "/login");
  });

  it("handles vote error correctly", async () => {
    const errorMessage = "Error voting";
    axios.put.mockRejectedValueOnce({
      response: { data: { error: errorMessage } },
    });

    render(
      <TestWrapper store={store}>
        <Question />
      </TestWrapper>
    );

    const downvoteButton = screen.getByTestId("vote-down-button");
    fireEvent.click(downvoteButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
  it("shows add answer component to logged in user only", async () => {
    render(
      <TestWrapper store={store}>
        <Question />
      </TestWrapper>
    );
    const addAnswerForm = await screen.findByText(/add your answer/i);
    expect(addAnswerForm).toBeInTheDocument();
  });
});
