import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import TagsInput from "react-tagsinput";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useValidation from "../../hooks/useValidation";
import { Spinner } from "../layouts/Spinner";
import { getEnvironments } from "../../helpers/getEnvironments";
import { getConfig } from "../../helpers/utilities";

export const Ask = () => {
  const { VITE_BASE_URL } = getEnvironments();
  const [question, setQuestion] = useState({
    title: "",
    body: "",
    tags: [],
  });
  const { isLoggedIn, token } = useSelector((state) => state.user);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleTagsInputChange = (tags) => {
    setQuestion({
      ...question,
      tags,
    });
  };
  const storeQuestion = async (e) => {
    e.preventDefault();
    // Add front-end validation
    if (!question.title.trim() || !question.body.trim()) {
      setErrors({
        title: ["The title field is required"],
        body: ["The body field is required"],
      });
      return;
    }
    try {
      const response = await axios.post(
        `${VITE_BASE_URL}/api/question/store`,
        question,
        getConfig(token)
      );
      setSubmitting(false);
      toast.success(response.data.message);
      navigate("/");
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
      <div className="col-md-6 mx-auto">
        <div className="card shadow-sm">
          <div className="car-header bg-white">
            <h5 className="text-center mt-2">Ask question</h5>
          </div>
          <div className="card-body">
            <form className="mt-5" onSubmit={(e) => storeQuestion(e)}>
              <div className="mb-3">
                <label htmlFor="title">Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  onChange={(e) =>
                    setQuestion({
                      ...question,
                      title: e.target.value,
                    })
                  }
                  value={question.title}
                />
                {useValidation(errors, "title")}
              </div>
              <div className="mb-3">
                <label htmlFor="body">Body*</label>
                <ReactQuill
                  theme="snow"
                  value={question.body}
                  onChange={(value) =>
                    setQuestion({
                      ...question,
                      body: value,
                    })
                  }
                />
                {useValidation(errors, "body")}
              </div>
              <div className="mb-3">
                <label htmlFor="tags">Tags</label>
                <TagsInput
                  value={question.tags}
                  onChange={handleTagsInputChange}
                />
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
