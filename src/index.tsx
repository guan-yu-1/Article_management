import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "@css/base.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);
