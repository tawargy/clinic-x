import { useState, useEffect } from "react";
import { getDiagnosesByIdApi } from "../api/diagnosis";
import { TDiagnoses } from "../types";

export function useDiagnosis() {
  const [diagnoses, setDiagnoses] = useState<TDiagnoses>();
  const [diagnosesId, setDiagnosesId] = useState<string>("");

  const getDiagnosis = async () => {
    try {
      if (!diagnosesId) return;
      const res = await getDiagnosesByIdApi(diagnosesId);

      res && setDiagnoses(res);
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    getDiagnosis();
  }, [diagnosesId]);

  return {
    diagnoses,
    setDiagnosesId,
    setDiagnoses,
    refreshDiagnosis: getDiagnosis,
  };
}
