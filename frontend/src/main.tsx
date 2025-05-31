import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-quill/dist/quill.snow.css";
import { Provider } from "react-redux";
import "react-tagsinput/react-tagsinput.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.js";
import "./index.css";
import { persistor, store } from "./redux/store/index.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ToastContainer position="top-right" />
        <div className="container">
          <div className="card mb-4 bg-light">
            <div className="card-body">
              <App />
            </div>
          </div>
        </div>
      </PersistGate>
    </Provider>
  </StrictMode>
);
