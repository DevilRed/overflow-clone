import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestions,
  fetchNextPrevPage,
  filterQuestionsByTag,
  clearFilter,
} from "../redux/slices/questionSlice";
import { QuestionList } from "./questions/QuestionList";
import { Spinner } from "./layouts/Spinner";
import { Link } from "react-router-dom";

export const Home = () => {
  const dispatch = useDispatch();
  const { showAll, loading, page, choosenTag, choosenUser } = useSelector(
    (state) => state.questions
  );
  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchQuestions({ page, choosenTag, choosenUser }));
  }, [dispatch, page, choosenTag, choosenUser]);

  const handleFetchNextPrevQuestionPage = (url) => {
    dispatch(fetchNextPrevPage(url));
  };
  const handleFilterByTag = (tag) => dispatch(filterQuestionsByTag(tag));
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
