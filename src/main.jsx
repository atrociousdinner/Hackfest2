import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { MainContextProvider } from "./context/primaryContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <MainContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MainContextProvider>
);
