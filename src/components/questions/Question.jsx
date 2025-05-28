import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Parser } from "html-to-react";
import { fetchQuestionBySlug } from "../../redux/slices/questionSlice";
import { Spinner } from "../layouts/Spinner";
import { getConfig } from "../../helpers/utilities";
import { toast } from "react-toastify";
import axios from "axios";
import { getEnvironments } from "../../helpers/getEnvironments";
import { Answer } from "../answers/Answer";
import { AddAnswer } from "./AddAnswer";

const { VITE_BASE_URL } = getEnvironments();

export const Question = () => {
  const dispatch = useDispatch();
  const { question, loading, error } = useSelector((state) => state.questions);
  const { slug } = useParams();
  const { isLoggedIn, token } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchQuestionBySlug({ slug }));
  }, [slug, dispatch]);

  const voteQuestion = async (slug, type) => {
    try {
      const response = await axios.put(
        `${VITE_BASE_URL}/api/vote/${slug}/${type}/question`,
        null,
        getConfig(token)
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        dispatch(fetchQuestionBySlug({ slug }));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error);
      // console.log(error);
    }
  };
  const deleteAnswer = async (answerId) => {
    if (confirm("Are you sure want to delete this answer")) {
      try {
        const response = await axios.delete(
          `${VITE_BASE_URL}/api/delete/${question.slug}/${answerId}/answer`,
          getConfig(token)
        );
        const slug = question.slug;
        dispatch(fetchQuestionBySlug({ slug }));
        toast.success(response.data.message);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (error) {
    return (
      <div className="row my-5">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              <div className="alert alert-danger my-3">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (loading || !question) {
    return (
      <div className="d-flex justify-content-center my-3" data-testid="spinner">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="row my-5">
      <div className="col-md-10 mx-auto">
        <div className="card">
          <div className="card-header bg-white">
            <h4 className="my-4">{question?.title}</h4>

            <div className="d-flex align-self-end">
              <img
                src={question?.user?.image}
                alt="user image"
                className="rounded-circle me-2"
                width={30}
                height={30}
              />
              <span className="text-primary me-2">{question?.user?.name}</span>
              <span className="text-danger me-2">
                Asked {question?.created_at}
              </span>
              <span className="text-dark">{question?.viewCount}</span>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 d-flex flex-column align-items-center">
                {isLoggedIn ? (
                  <span
                    className="voteUp"
                    data-testid="vote-up-button"
                    onClick={() => voteQuestion(question.slug, "up")}
                  >
                    <i className="bi bi-arrow-up-circle h2"></i>
                  </span>
                ) : (
                  <Link
                    to="/login"
                    className="voteUp"
                    data-testid="vote-up-button"
                  >
                    <i className="bi bi-arrow-up-circle h2"></i>
                  </Link>
                )}

                <span className="fw-bold">{question?.score}</span>

                {isLoggedIn ? (
                  <span
                    className="voteDown"
                    data-testid="vote-down-button"
                    onClick={() => voteQuestion(question.slug, "down")}
                  >
                    <i className="bi bi-arrow-down-circle h2"></i>
                  </span>
                ) : (
                  <Link to="/login" className="voteDown">
                    <i className="bi bi-arrow-down-circle h2"></i>
                  </Link>
                )}
              </div>
              <div className="col-md-7">{Parser().parse(question?.body)}</div>
            </div>
          </div>

          {question?.tags?.length > 0 && (
            <div className="card-footer bg-white">
              <div className="d-flex flex-wrap">
                {question?.tags?.map((tag, index) => (
                  <span key={index} className="badge bg-primary me-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="card bo-light mt-2">
          <div className="card-header bg-white">
            <h5 className="mt-2">
              <i>{question?.answerCount}</i>
            </h5>
          </div>
          <div className="card-body">
            {isLoggedIn && <AddAnswer />}
            {question?.answers?.length > 0 &&
              question.answers.map((answer) => (
                <Answer
                  key={answer.id}
                  answer={answer}
                  question={question}
                  onDeleteAnswer={deleteAnswer}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
