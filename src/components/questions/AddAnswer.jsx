import { useState } from "react";
import ReactQuill from "react-quill";
import useValidation from "../../hooks/useValidation";
import { Spinner } from "../layouts/Spinner";
import axios from "axios";
import { fetchQuestionBySlug } from "../../redux/slices/questionSlice";
import { useDispatch, useSelector } from "react-redux";
import { getEnvironments } from "../../helpers/getEnvironments";
import { getConfig } from "../../helpers/utilities";
import { toast } from "react-toastify";

const { VITE_BASE_URL } = getEnvironments();

export const AddAnswer = () => {
  const [answer, setAnswer] = useState({
    body: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const { question } = useSelector((state) => state.questions);
  const { token } = useSelector((state) => state.user);

  const storeAnswer = async (e) => {
    e.preventDefault();
    // front-end validation
    if (!answer.body.trim()) {
      setErrors({
        body: ["The body field is required"],
      });
      return;
    }
    try {
      const response = await axios.post(
        `${VITE_BASE_URL}/api/answer/${question.slug}/store`,
        answer,
        getConfig(token)
      );
      setSubmitting(false);
      const slug = question.slug;
      dispatch(fetchQuestionBySlug({ slug }));
      setAnswer({
        body: "",
      });
      toast.success(response.data.message);
    } catch (error) {
      setSubmitting(false);
      if (error?.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
      console.log(error);
    }
  };
  return (
    <div className="row mt-5">
      <div className="col-md-10 mx-auto">
        <div className="card shadow-sm">
          <div className="car-header bg-white">
            <h5 className="text-center mt-2">Add your answer</h5>
          </div>
          <div className="card-body">
            <form
              data-testid="answer-form"
              className="mt-5"
              onSubmit={(e) => storeAnswer(e)}
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
