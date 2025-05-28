import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEnvironments } from "../../helpers/getEnvironments";
import { getConfig } from "../../helpers/utilities";
import { Spinner } from "../layouts/Spinner";
import { UserQuestions } from "./questions/UserQuestions";

const { VITE_BASE_URL } = getEnvironments();

export const Profile = () => {
  const { isLoggedIn, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  // const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchUserQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${VITE_BASE_URL}/api/user/questions`,
        getConfig(token)
      );
      setLoading(false);
      if (response.data.data.length) {
        setQuestions(response.data.data);
      }
    } catch (error) {
      setMessage("No questions yet");
    }
  };

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
    fetchUserQuestions();
  }, []);

  if (message) {
    return (
      <div className="row my-5">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              <div className="alert alert-info my-3">{message}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-3" data-testid="spinner">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row my-5">
        <UserQuestions questions={questions} />
      </div>
    </div>
  );
};
