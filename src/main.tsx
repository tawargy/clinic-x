import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./contextApi/context";
import AppRouter from "./routes/AppRouter";
import "./main.css";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <AppRouter />
    </AppProvider>
  </React.StrictMode>,
);
