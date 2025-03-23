import { createContext, ReactNode, useState, useMemo, useContext } from "react";
import { TPatientInfo, TPrescription } from "../types";
import { patientInit, prescriptionsInit } from "../initData";

interface ClinicContextType {
  patientInfo: TPatientInfo | undefined;
  setPatientInfo: (patient: TPatientInfo) => void;
  isAppointment: boolean;
  setIsAppointment: (isAppointments: boolean) => void;
  prescriptions: TPrescription[];
  setPrescriptions: (p: TPrescription[]) => void;
  medicine: TPrescription;
  setMedicine: (m: TPrescription) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

function ClinicProvider({ children }: { children: ReactNode }) {
  const [patientInfo, setPatientInfo] = useState<TPatientInfo | undefined>(
    patientInit,
  );
  const [isAppointment, setIsAppointment] = useState(false);
  const [prescriptions, setPrescriptions] = useState<TPrescription[]>([]);
  const [medicine, setMedicine] = useState<TPrescription>(prescriptionsInit);
  const memoizedValue = useMemo(
    () => ({
      patientInfo,
      setPatientInfo,
      isAppointment,
      setIsAppointment,
      prescriptions,
      setPrescriptions,
      medicine,
      setMedicine,
    }),
    [
      patientInfo,
      setPatientInfo,
      isAppointment,
      setIsAppointment,
      prescriptions,
      setPrescriptions,
      medicine,
      setMedicine,
    ],
  );

  return (
    <ClinicContext.Provider value={memoizedValue}>
      {children}
    </ClinicContext.Provider>
  );
}

const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
};

export { ClinicProvider, useClinic };
