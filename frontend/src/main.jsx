import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from './App.jsx'
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import "react-tagsinput/react-tagsinput.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store/index.js";
import { PersistGate } from "redux-persist/integration/react";

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
