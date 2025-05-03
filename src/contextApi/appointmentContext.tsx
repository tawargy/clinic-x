import { createContext, useContext, useReducer, ReactNode } from "react";
import appointmentReducer from "./reducers/appointmentReducer";
import diagnosesReducer from "./reducers/diagnosesReducer";
import requstsReducer from "./reducers/requstsReducer";
import appointmentFeesReducer from "./reducers/appointmentFees";
import { TRequest, TAppointmentFees } from "../types";
import { TAppointment, TDiagnosis } from "../types";
import { appointmentInit } from "../initData";

const appointmentFeesInit: TAppointmentFees = {
  id: "",
  patient_id: "",
  patient_name: "",
  patient_phone: "",
  appointment_type: "",
  fee: "",
  services: [],
  total_fees: "",
  date: "",
  time_stamp: "",
};

type TAppointmentContext = {
  appointment: TAppointment;
  diagnoses: TDiagnosis[];
  requests: TRequest[];
  appointmentFees: TAppointmentFees;
  setVitals: React.Dispatch<any>;
  addComplaint: React.Dispatch<any>;
  addPresentHistory: React.Dispatch<any>;
  addExamination: React.Dispatch<any>;
  setDiagnosisId: React.Dispatch<any>;
  addPrescription: React.Dispatch<any>;
  removePrescription: React.Dispatch<any>;
  addDiagnosis: (diagnosis: TDiagnosis) => void;
  removeDiagnosis: (index: number) => void;
  addRequest: (request: TRequest) => void;
  removeRequest: (id: string) => void;
  setFee: (fee: string) => void;
  addService: (service: { service_name: string; service_fee: string }) => void;
  removeService: (index: number) => void;
  updateService: (
    index: number,
    service: { service_name: string; service_fee: string },
  ) => void;
  resetAll: () => void;
};

const AppointmentContext = createContext<TAppointmentContext | undefined>(
  undefined,
);

function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointment, appointmentDispatch] = useReducer(
    appointmentReducer,
    appointmentInit,
  );
  const [diagnoses, diagnosesDispatch] = useReducer(diagnosesReducer, []);
  const [requests, requestsDispatch] = useReducer(requstsReducer, []);
  const [appointmentFees, appointmentFeesDispatch] = useReducer(
    appointmentFeesReducer,
    appointmentFeesInit,
  );

  const resetAll = () => {
    appointmentDispatch({ type: "RESET", payload: appointmentInit });
    diagnosesDispatch({ type: "RESET", payload: [] });
    requestsDispatch({ type: "RESET", payload: [] });
    requestsDispatch({ type: "RESET", payload: appointmentFeesInit });
  };

  const setVitals = (payload: any) => {
    appointmentDispatch({ type: "VAITALS", payload });
  };
  const addComplaint = (payload: any) => {
    appointmentDispatch({ type: "COMPLAINT", payload });
  };
  const addPresentHistory = (payload: any) => {
    appointmentDispatch({ type: "PRESENT_HISTORY", payload });
  };
  const addExamination = (payload: any) => {
    appointmentDispatch({ type: "EXAMINATION", payload });
  };
  const setDiagnosisId = (payload: any) => {
    appointmentDispatch({ type: "DIAGNOSES", payload });
  };
  const addPrescription = (payload: any) => {
    appointmentDispatch({ type: "ADD_PRESCRIPTION", payload });
  };
  const removePrescription = (index: number) => {
    appointmentDispatch({ type: "REMOVE_PRESCRIPTION", payload: index });
  };
  // Diagnosis actions
  const addDiagnosis = (diagnosis: TDiagnosis) => {
    diagnosesDispatch({ type: "ADD_DIAGNOSIS", payload: diagnosis });
  };

  const removeDiagnosis = (index: number) => {
    diagnosesDispatch({ type: "REMOVE_DIAGNOSIS", payload: index });
  };
  // Requestes actions
  const addRequest = (request: TRequest) => {
    requestsDispatch({ type: "ADD_REQUEST", payload: request });
  };

  const removeRequest = (id: string) => {
    requestsDispatch({ type: "REMOVE_REQUEST", payload: id });
  };
  // Appointment fees actions

  const setFee = (fee: string) => {
    appointmentFeesDispatch({ type: "SET_FEE", payload: fee });
  };

  const addService = (service: {
    service_name: string;
    service_fee: string;
  }) => {
    appointmentFeesDispatch({ type: "ADD_SERVICE", payload: service });
  };

  const removeService = (index: number) => {
    appointmentFeesDispatch({ type: "REMOVE_SERVICE", payload: index });
  };

  const updateService = (
    index: number,
    service: { service_name: string; service_fee: string },
  ) => {
    appointmentFeesDispatch({
      type: "UPDATE_SERVICE",
      payload: { index, service },
    });
  };
  return (
    <AppointmentContext.Provider
      value={{
        appointment,
        diagnoses,
        requests,
        appointmentFees,
        setVitals,
        addComplaint,
        addPresentHistory,
        addExamination,
        setDiagnosisId,
        addPrescription,
        removePrescription,
        addDiagnosis,
        removeDiagnosis,
        addRequest,
        removeRequest,
        setFee,
        addService,
        removeService,
        updateService,
        resetAll,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
};

export { AppointmentProvider, useAppointment };
