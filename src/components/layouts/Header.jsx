import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getEnvironments } from "../../helpers/getEnvironments";
import { getConfig, setActiveLink } from "../../helpers/utilities";
import {
  setCurrentUser,
  setLoggedInOut,
  setToken,
} from "../../redux/slices/userSlice";
import { toast } from "react-toastify";

export const Header = () => {
  const { VITE_BASE_URL } = getEnvironments();
  const { isLoggedIn, token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getNavLinkClass = (path) => `nav-link ${setActiveLink(location, path)}`;

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const response = await axios.get(
          `${VITE_BASE_URL}/api/user`,
          getConfig(token)
        );
        dispatch(setCurrentUser(response.data.data));
      } catch (error) {
        // check if token has expired
        if (error?.response?.status === 401) {
          dispatch(setLoggedInOut(false));
          dispatch(setCurrentUser(null));
          dispatch(setToken(""));
        }
        console.log(error);
      }
    };
    if (token) {
      getLoggedInUser();
    }
  }, [token]);

  const logoutUser = async () => {
    try {
      const response = await axios.post(
        `${VITE_BASE_URL}/api/user/logout`,
        null,
        getConfig(token)
      );
      dispatch(setLoggedInOut(false));
      dispatch(setCurrentUser(null));
      dispatch(setToken(""));
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          React Stack
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={getNavLinkClass("/")} aria-current="page" to="/">
                <i className="bi bi-house"></i> Home
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className={getNavLinkClass("/profile")} to="/profile">
                    <i className="bi bi-person"></i> {user?.name}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link" onClick={() => logoutUser()}>
                    <i className="bi bi-person-fill-down"></i> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={getNavLinkClass("/register")} to="/register">
                    <i className="bi bi-person-add"></i> Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={getNavLinkClass("/login")} to="/login">
                    <i className="bi bi-person-fill-up"></i> Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
