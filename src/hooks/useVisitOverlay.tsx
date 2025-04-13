import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getDiagnosisByIdApi } from "../api/diagnosis";
import { getAppointmentWrapperByIdApi } from "../api/appointmentWrapper";
import { TAllDiagnosis, TAppointment, TAppointmentWrapper } from "../types";

import { appointmentInit, appointmentWrapperInit } from "../initData";

export function useVisitOverlay(appointment_wrapper_id: string) {
  const [appointment, setAppointment] = useState<TAppointment>(appointmentInit);
  const [appointmentWrapper, setAppointmentWrapper] =
    useState<TAppointmentWrapper>(appointmentWrapperInit);
  const [appointmentId, setAppointmentId] = useState("");
  const [diagnosis, setDiagnosis] = useState<TAllDiagnosis>();

  const getAppointment = async (id: string) => {
    try {
      if (!id) return;
      const res = await invoke<TAppointment>("get_appointment_by_id", {
        appointmentId: id,
      });
      const diagRes = await getDiagnosisByIdApi(res.provisional_diagnosis);
      diagRes && setDiagnosis(diagRes);
      setAppointment(res);
      //  setPrescriptions(res.prescription);
    } catch (e) {
      console.log("error", e);
    }
  };
  const getAppointmentWrapper = async (id: string) => {
    try {
      const res = await getAppointmentWrapperByIdApi(id);
      res && setAppointmentWrapper(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAppointmentWrapper(appointment_wrapper_id);
    getAppointment(appointmentId);
    //  return () => setPrescriptions([]);
  }, [appointmentId]);

  return {
    appointmentWrapper,
    appointment,
    appointmentId,
    setAppointmentId,
    diagnosis,
  };
}
