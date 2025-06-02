import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  clearFilter,
  fetchNextPrevPage,
  fetchQuestions,
  filterQuestionsByTag,
} from "../redux/slices/questionSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Spinner } from "./layouts/Spinner";
import { QuestionList } from "./questions/QuestionList";

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showAll, loading, page, choosenTag, choosenUser } = useSelector(
    (state: RootState) => state.questions
  );
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchQuestions({ page, choosenTag, choosenUser }));
  }, [dispatch, page, choosenTag, choosenUser]);

  const handleFetchNextPrevQuestionPage = (url: string) => {
    dispatch(fetchNextPrevPage(url));
  };
  const handleFilterByTag = (tag: string) => dispatch(filterQuestionsByTag(tag));
  const handleClearFilter = () => dispatch(clearFilter());

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-3">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="row my-5">
        <div className="col-md-10 mx-auto">
          <div className="row">
            {isLoggedIn && (
              <div className="d-flex justify-content-end mb-2">
                <Link to="/ask" className="btn btn-primary">
                  <i className="bi bi-pencil"></i> Ask
                </Link>
              </div>
            )}
            {showAll && (
              <div className="col-md-12">
                <div className="mb-2">
                  <button className="btn btn-dark" onClick={handleClearFilter}>
                    All questions
                  </button>
                </div>
              </div>
            )}
            <QuestionList
              fetchQuestionsPage={handleFetchNextPrevQuestionPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};
