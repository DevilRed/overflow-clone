export const initialState = {
  questions: {
    data: [], // List of questions
    meta: null, // Pagination metadata
  },
  question: null,
  loading: false,
  page: 1,
  error: null,
  choosenTag: "",
  choosenUser: "",
  nexPageLink: null,
  prevPageLink: null,
  showAll: false,
};
