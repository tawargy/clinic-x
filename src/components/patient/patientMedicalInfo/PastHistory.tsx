import { useEffect, useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { TpatientMedicalHistory, TAllDiagnosis } from "../../../types";
import { invoke } from "@tauri-apps/api/core";

type TProps = {
  patientId: string;
  isEdit: boolean;
  patientMedicalHistory: TpatientMedicalHistory;
  setPatientMedicalHistory: React.Dispatch<
    React.SetStateAction<TpatientMedicalHistory>
  >;
};

function PastHistory({ patientId, isEdit }: TProps) {
  const { darkMode } = useAppSettings();
  const [expandedSections, setExpandedSections] = useState(true);
  const [allDiagnosis, setAllDiagnosis] = useState<TAllDiagnosis[]>([]);

  const getPatientDiagnosisApi = async () => {
    try {
      const res = await invoke<TAllDiagnosis[]>(
        "get_all_diagnosis_by_patient_id",
        {
          patientId,
        },
      );
      console.log("getAllDiagnosis", res);
      setAllDiagnosis(res);
    } catch (e) {
      console.error("Error saving appointment:", e);
    }
  };

  useEffect(() => {
    getPatientDiagnosisApi();
  }, []);

  useEffect(() => {
    if (isEdit) {
      setExpandedSections(false);
    }
  }, [isEdit]);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } w-full rounded-lg shadow-md p-2 mb-1 transition-colors duration-200`}
    >
      <div
        className="flex items-center cursor-pointer mb-2"
        onClick={() => setExpandedSections(!expandedSections)}
      >
        <h4
          className={`text-lg font-medium ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Past History
        </h4>
        <span className="ml-2 text-gray-400">
          {expandedSections ? "▼" : "▲"}
        </span>
      </div>

      {expandedSections && (
        <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {allDiagnosis.map((d) => (
              <div key={d.id}>
                {d.diagnosis
                  ?.filter((dd) => dd.diagnosis_type === "chronic")
                  .map((dd, i) => (
                    <div
                      key={i}
                      className={`border ${
                        darkMode
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-200 bg-gray-50"
                      } p-3 rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col gap-1 mb-2`}
                    >
                      <div
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-800"
                        } flex justify-between items-center`}
                      >
                        <span className="text-lg">{dd.diagnosis_title}</span>
                        <span
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Since: {dd.start}
                        </span>
                      </div>
                      {dd.comment && (
                        <p
                          className={`${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          } whitespace-pre-wrap text-sm leading-relaxed mt-1`}
                        >
                          {dd.comment}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PastHistory;
