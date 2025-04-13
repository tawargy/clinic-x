import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./contextApi/appContext";
import { ClinicProvider } from "./contextApi/clinicContext";
import { AppointmentProvider } from "./contextApi/appointmentContext";
import AppRouter from "./routes/AppRouter";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <ClinicProvider>
        <AppointmentProvider>
          <AppRouter />
        </AppointmentProvider>
      </ClinicProvider>
    </AppProvider>
  </React.StrictMode>,
);
