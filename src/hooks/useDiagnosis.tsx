import { useState, useEffect } from "react";
import { getDiagnosisByIdApi } from "../api/diagnosis";

import { TAllDiagnosis } from "../types";

export function useDiagnosis() {
  const [diagnosis, setDiagnosis] = useState<TAllDiagnosis>();
  const [diagnosisId, setDiagnosisId] = useState<string>("");

  const getDiagnosis = async () => {
    try {
      if (!diagnosisId) return;
      console.log("getDiagnosis");
      const res = await getDiagnosisByIdApi(diagnosisId);

      res && setDiagnosis(res);
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    getDiagnosis();
  }, [diagnosisId]);

  return {
    diagnosis,
    setDiagnosisId,
  };
}
