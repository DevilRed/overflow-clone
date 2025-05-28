import { describe, it, expect, vi } from "vitest";
import {
  questionsSlice,
  setPage,
  filterQuestionsByTag,
  filterQuestionsByUser,
  clearFilter,
  fetchNextPrevPage,
  fetchQuestions,
} from "./questionSlice";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";

import { initialState } from "../../../tests/fixtures/questionSliceFixture";

// Mock axios
vi.mock("axios");

describe("questionSlice", () => {
  it("should set page", () => {
    const state = questionsSlice.reducer(initialState, setPage(2));
    expect(state).toEqual({
      ...initialState,
      page: 2,
    });
  });
  it("should filter questions by tag", () => {
    const state = questionsSlice.reducer(
      initialState,
      filterQuestionsByTag("lala")
    );
    expect(state).toEqual({
      ...initialState,
      choosenTag: "lala",
      choosenUser: "",
      page: 1,
      showAll: true,
    });
  });
  it("should filter questions by user", () => {
    const state = questionsSlice.reducer(
      initialState,
      filterQuestionsByUser(55)
    );
    expect(state).toEqual({
      ...initialState,
      choosenTag: "",
      choosenUser: 55,
      page: 1,
      showAll: true,
    });
  });
  it("should clear filter", () => {
    const state = questionsSlice.reducer(initialState, clearFilter());
    expect(state).toEqual({
      ...initialState,
      choosenTag: "",
      choosenUser: "",
      page: 1,
      showAll: false,
    });
  });
  it("should fetch next prev page", () => {
    const pageNumber = "5";
    // Mock the URL constructor
    const mockURL = vi.fn().mockImplementation((url) => {
      return {
        searchParams: {
          get: vi.fn().mockReturnValue(pageNumber), // Mock the page number
        },
      };
    });
    // Replace the global URL constructor with the mock
    global.URL = mockURL;

    // Create a mock action
    const action = { payload: "http://example.com?page=5" };

    const state = questionsSlice.reducer(
      initialState,
      fetchNextPrevPage(action.payload)
    );

    expect(state.page).toBe(Number(pageNumber));

    // Restore the original URL constructor
    global.URL = URL;
  });
});

describe("questionSlice async thunks", () => {
  it("should fetch questions successfully", async () => {
    const mockData = {
      data: {
        data: [{ id: 1, title: "Question 1" }],
        meta: { total: 1 },
        links: { next: null, prev: null },
      },
    };

    axios.get.mockResolvedValueOnce(mockData);

    const store = configureStore({
      reducer: {
        questions: questionsSlice.reducer,
      },
    });

    await store.dispatch(
      fetchQuestions({ page: 1, choosenTag: "", choosenUser: "" })
    );

    const state = store.getState().questions;

    expect(state.questions.data).toEqual(mockData.data.data);
    expect(state.questions.meta).toEqual(mockData.data.meta);
    expect(state.nextPageLink).toBeNull();
    expect(state.prevPageLink).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should handle fetch questions failure", async () => {
    const errorMessage = "Network Error";

    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const store = configureStore({
      reducer: {
        questions: questionsSlice.reducer,
      },
    });

    await store.dispatch(
      fetchQuestions({ page: 1, choosenTag: "", choosenUser: "" })
    );

    const state = store.getState().questions;

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});