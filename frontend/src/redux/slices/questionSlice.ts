import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getEnvironments } from "../../helpers/getEnvironments";
import { EnvironmentVariables } from "../../types/";

const { VITE_BASE_URL } = getEnvironments() as EnvironmentVariables;

// Define types for the question data
interface Question {
  id: string;
  title: string;
  slug: string;
  // Add other question properties as needed
  [key: string]: any;
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
}

interface QuestionsState {
  questions: {
    data: Question[];
    meta: Meta | null;
  };
  question: Question | null;
  loading: boolean;
  page: number;
  error: string | null;
  choosenTag: string;
  choosenUser: string;
  nextPageLink: string | null;
  prevPageLink: string | null;
  showAll: boolean;
}


// Define the initial state with type
const initialState: QuestionsState = {
  questions: {
    data: [],
    meta: null,
  },
  question: null,
  loading: false,
  page: 1,
  error: null,
  choosenTag: "",
  choosenUser: "",
  nextPageLink: null,
  prevPageLink: null,
  showAll: false,
};

// Define types for the thunk arguments
interface FetchQuestionsArgs {
  page: number;
  choosenTag?: string;
  choosenUser?: string;
}

interface FetchQuestionBySlugArgs {
  slug: string;
}

type ErrorType = {
  message: string | null
}


export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async ({ page, choosenTag, choosenUser }: FetchQuestionsArgs, { rejectWithValue }) => {
    let query = `${VITE_BASE_URL}/api/questions?page=${page}`;

    if (choosenTag) {
      query = `${VITE_BASE_URL}/api/tag/${choosenTag}/questions?page=${page}`;
    } else if (choosenUser) {
      query = `${VITE_BASE_URL}/api/user/questions?page=${page}`;
    }

    try {
      let response = null;
      if (choosenUser) {
        response = await axios.post(query, { user_id: choosenUser });
      } else {
        response = await axios.get(query);
      }
      return {
        data: response.data.data, // List of questions
        meta: response.data.meta, // Pagination metadata
        links: response.data.meta.links, // Links for navigation
      };
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        return rejectWithValue((error as ErrorType).message);
      }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

export const fetchQuestionBySlug = createAsyncThunk(
  "question/fetchQuestionBySlug",
  async ({ slug }: FetchQuestionBySlugArgs, { rejectWithValue }) => {
    const query = `${VITE_BASE_URL}/api/question/${slug}/show`;
    try {
      const response = await axios.get(query);
      return {
        data: response.data.data,
      };
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred while fetching the question.");
    }
  }
);

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    filterQuestionsByTag: (state, action: PayloadAction<string>) => {
      state.choosenTag = action.payload;
      state.choosenUser = "";
      state.page = 1;
      state.showAll = true;
    },
    filterQuestionsByUser: (state, action: PayloadAction<string>) => {
      state.choosenUser = action.payload;
      state.choosenTag = "";
      state.page = 1;
      state.showAll = true;
    },
    clearFilter: (state) => {
      state.choosenUser = "";
      state.choosenTag = "";
      state.page = 1;
      state.showAll = false;
    },
    fetchNextPrevPage: (state, action: PayloadAction<string>) => {
      const url = new URL(action.payload);
      state.page = Number(url.searchParams.get("page"));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;

        // save pagination links to state (if available)
        const links = action.payload.links || {};
        state.nextPageLink = links.next || null;
        state.prevPageLink = links.prev || null;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : String(action.payload);
      });
    builder
      .addCase(fetchQuestionBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.question = action.payload.data;
      })
      .addCase(fetchQuestionBySlug.rejected, (state) => {
        state.loading = false;
        state.error = "The question you are looking for does not exist.";
      });
  },
});

export const {
  setPage,
  filterQuestionsByTag,
  filterQuestionsByUser,
  clearFilter,
  fetchNextPrevPage,
} = questionsSlice.actions;

export default questionsSlice.reducer;
