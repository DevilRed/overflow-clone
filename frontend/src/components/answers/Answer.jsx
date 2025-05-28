import { Parser } from "html-to-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getEnvironments } from "../../helpers/getEnvironments";
import axios from "axios";
import { getConfig } from "../../helpers/utilities";
import { fetchQuestionBySlug } from "../../redux/slices/questionSlice";
import { toast } from "react-toastify";

const { VITE_BASE_URL } = getEnvironments();

export const Answer = ({ answer, question, onDeleteAnswer }) => {
  const dispatch = useDispatch();
  const voteAnswer = async (answerId, type) => {
    try {
      const response = await axios.put(
        `${VITE_BASE_URL}/api/vote/${answerId}/${type}/answer`,
        null,
        getConfig(token)
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        const slug = question.slug;
        dispatch(fetchQuestionBySlug({ slug }));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };
  const { isLoggedIn, token, user } = useSelector((state) => state.user);

  const markAnswerAsBest = async (answerId) => {
    try {
      const response = await axios.put(
        `${VITE_BASE_URL}/api/mark/${answerId}/best`,
        null,
        getConfig(token)
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        const slug = question.slug;
        dispatch(fetchQuestionBySlug({ slug }));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };
  const renderAnswerActions = () =>
    answer.user.id === user?.id && (
      <div className="card-header bg-white d-flex justify-content-end">
        <div className="dropdown ms-auto">
          <i
            className="bi bi-three-dots-vertical"
            data-bs-toggle="dropdown"
          ></i>
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to={`/edit/answer/${answer.id}`}>
                <i className="bi bi-pen mx-2 text-warning">Edit</i>
              </Link>
            </li>
            <li>
              <span
                className="dropdown-item"
                style={{ cursor: "pointer" }}
                onClick={() => onDeleteAnswer(answer.id)}
              >
                <i className="bi bi-trash mx-2 text-danger">Delete</i>
              </span>
            </li>
          </ul>
        </div>
      </div>
    );

  return (
    <div className="card my-2">
      {renderAnswerActions()}
      <div className="card-body">
        <div className="row">
          <div className="col-md-3 d-flex flex-column align-items-center">
            {isLoggedIn ? (
              <span
                className="voteUp"
                data-testid="answer-vote-up"
                onClick={() => voteAnswer(answer.id, "up")}
              >
                <i className="bi bi-arrow-up-circle h2"></i>
              </span>
            ) : (
              <Link to="/login" className="voteUp" data-testid="answer-vote-up">
                <i className="bi bi-arrow-up-circle h2"></i>
              </Link>
            )}

            <span className="fw-bold">{answer?.score}</span>
            {answer.best_answer ? (
              <i
                className="bi bi-check h2 text-success mt-2"
                data-testid="best-answer-icon"
              ></i>
            ) : (
              ""
            )}

            {isLoggedIn ? (
              <span
                className="voteDown"
                data-testid="answer-vote-down"
                onClick={() => voteAnswer(answer.id, "down")}
              >
                <i className="bi bi-arrow-down-circle h2"></i>
              </span>
            ) : (
              <Link
                to="/login"
                className="voteDown"
                data-testid="answer-vote-down"
              >
                <i className="bi bi-arrow-down-circle h2"></i>
              </Link>
            )}
          </div>
          <div className="col-md-7">{Parser().parse(answer?.body)}</div>
        </div>
      </div>
      <div className="card-footer">
        <div className="d-flex justify-content-between bg-white">
          <div className="d-flex">
            <img
              src={answer?.user?.image}
              alt="user image"
              className="rounded-circle me-2"
              width={30}
              height={30}
            />
            <span className="text-primary me-2">{answer?.user?.name}</span>
            <span className="text-danger me-2">Asked {answer?.created_at}</span>
          </div>
          {isLoggedIn &&
            question.user.id === user.id &&
            !answer.best_answer && (
              <button
                className="btn btn-sm btn-success"
                data-testid="btn-mark-as-best"
                onClick={() => markAnswerAsBest(answer.id)}
              >
                Mark as best answer
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
