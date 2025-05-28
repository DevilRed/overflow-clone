import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import useValidation from "../../hooks/useValidation";
import { Spinner } from "../layouts/Spinner";
import axios from "axios";
import { fetchQuestionBySlug } from "../../redux/slices/questionSlice";
import { useDispatch, useSelector } from "react-redux";
import { getEnvironments } from "../../helpers/getEnvironments";
import { getConfig } from "../../helpers/utilities";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const { VITE_BASE_URL } = getEnvironments();

export const EditAnswer = () => {
  const [answer, setAnswer] = useState({
    body: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  // const dispatch = useDispatch();
  const { isLoggedIn, token, user } = useSelector((state) => state.user);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchAnswerById = async () => {
    setLoading(true);
    const query = `${VITE_BASE_URL}/api/answer/${id}/show`;
    try {
      const response = await axios.get(query, getConfig(token));
      console.log(response);
      setAnswer(response.data.data);
      setLoading(false);
    } catch (error) {
      if (error?.response?.status === 404) {
        setError("The answer does not exist");
      }
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
    fetchAnswerById();
  }, []);

  const updateAnswer = async (e) => {
    e.preventDefault();
    // front-end validation
    if (!answer.body.trim()) {
      setErrors({
        body: ["The body field is required"],
      });
      return;
    }
    try {
      setSubmitting(true);
      const response = await axios.put(
        `${VITE_BASE_URL}/api/update/${answer.question.slug}/${id}/answer`,
        answer,
        getConfig(token)
      );
      setSubmitting(false);
      /* const slug = answer.question.slug;
      dispatch(fetchQuestionBySlug({ slug }));*/
      setAnswer({
        body: "",
      });
      toast.success(response.data.message);
      navigate(`/question/${answer.question.slug}`);
    } catch (error) {
      setSubmitting(false);
      if (error?.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
      console.log(error);
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
  if (loading || !answer) {
    return (
      <div className="d-flex justify-content-center my-3" data-testid="spinner">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="row mt-5">
      <div className="col-md-10 mx-auto">
        <div className="card shadow-sm">
          <div className="car-header bg-white">
            <h5 className="text-center mt-2">Edit your answer</h5>
          </div>
          <div className="card-body">
            <form
              data-testid="answer-form"
              className="mt-5"
              onSubmit={(e) => updateAnswer(e)}
            >
              <div className="mb-3">
                <label htmlFor="body">Your answer*</label>
                <ReactQuill
                  theme="snow"
                  value={answer.body}
                  onChange={(value) =>
                    setAnswer({
                      ...answer,
                      body: value,
                    })
                  }
                />
                {useValidation(errors, "body")}
              </div>
              <div className="mb-3">
                {submitting ? (
                  <Spinner />
                ) : (
                  <button className="btn btn-sm btn-dark" type="submit">
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
