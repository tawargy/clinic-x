import { useEffect, useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { TpatientMedicalHistory, TDiagnoses, TDiagnosis } from "../../../types";
import { getAllDiagnosesByPatientIdApi } from "../../../api/diagnosis";
import { updateDiagnosisApi } from "../../../api/diagnosis";

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
  const [expandedSections, setExpandedSections] = useState(false);
  const [allDiagnoses, setAllDiagnoses] = useState<TDiagnoses[]>([]);
  const [editingDiagnosis, setEditingDiagnosis] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    diagnosis_title: string;
    diagnosis_type: string;
    start: string;
    end: string;
    comment: string;
  }>({
    diagnosis_title: "",
    diagnosis_type: "chronic", // Default to chronic since it's the Past History component
    start: "",
    end: "",
    comment: "",
  });

  const getPatientDiagnosisApi = async () => {
    try {
      const res = await getAllDiagnosesByPatientIdApi(patientId);
      setAllDiagnoses(res);
      // console.log(res);
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

  const handleCancelEdit = () => {
    setEditingDiagnosis(null);
  };

  const handleEditClick = (diagnosis: TDiagnosis) => {
    setEditingDiagnosis(diagnosis.id);
    setEditFormData({
      diagnosis_title: diagnosis.diagnosis_title,
      diagnosis_type: diagnosis.diagnosis_type,
      start: diagnosis.start,
      end: diagnosis.end || "",
      comment: diagnosis.comment || "",
    });
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (diagnosesId: string, diagnosisId: string) => {
    setIsSubmitting(true);

    // Create updated diagnoses array first
    const updatedDiagnoses = allDiagnoses.map((diagnoses) => {
      if (diagnoses.id === diagnosesId) {
        return {
          ...diagnoses,
          diagnoses: diagnoses.diagnoses?.map((diagnosis) => {
            if (diagnosis.id === diagnosisId) {
              return {
                ...diagnosis,
                ...editFormData,
              };
            }
            return diagnosis;
          }),
        };
      }
      return diagnoses;
    });

    // Update UI immediately
    setAllDiagnoses(updatedDiagnoses);
    setEditingDiagnosis(null);

    try {
      // Then send to the server
      const success = await updateDiagnosisApi(
        diagnosesId,
        diagnosisId,
        editFormData,
      );

      if (!success) {
        // If the update fails, refresh the data
        getPatientDiagnosisApi();
      }
    } catch (error) {
      console.error("Error updating diagnosis:", error);
      // On error, refresh the data
      getPatientDiagnosisApi();
    } finally {
      setIsSubmitting(false);
    }
  };

  const down = <span className="text-green-500">▼</span>;
  const up = <span>▲ </span>;
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
          {expandedSections ? down : up}
        </span>
      </div>

      {expandedSections && (
        <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {allDiagnoses.map((diagnoses) => (
              <div key={diagnoses.id}>
                {diagnoses.diagnoses
                  ?.slice()
                  .filter((diagnosis) => diagnosis.diagnosis_type === "chronic")

                  .reverse()

                  .map((diagnosis) => (
                    <div
                      key={diagnosis.id}
                      className={`border ${
                        darkMode
                          ? "border-gray-600 bg-gray-800"
                          : "border-gray-200 bg-gray-50"
                      } p-3 rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col gap-1 mb-2`}
                    >
                      {editingDiagnosis === diagnosis.id ? (
                        // Edit Form
                        <div className="flex flex-col gap-2">
                          <div>
                            <label
                              className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-1`}
                            >
                              Diagnosis Title
                            </label>
                            <input
                              type="text"
                              name="diagnosis_title"
                              value={editFormData.diagnosis_title}
                              onChange={handleInputChange}
                              className={`w-full p-2 rounded border ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            />
                          </div>

                          <div>
                            <label
                              className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-1`}
                            >
                              Start Date
                            </label>
                            <input
                              type="date"
                              name="start"
                              value={editFormData.start}
                              onChange={handleInputChange}
                              className={`w-full p-2 rounded border ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            />
                          </div>

                          <div>
                            <label
                              className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-1`}
                            >
                              Comments
                            </label>
                            <textarea
                              name="comment"
                              value={editFormData.comment}
                              onChange={handleInputChange}
                              rows={3}
                              className={`w-full p-2 rounded border ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300"
                              } resize-y`}
                            />
                          </div>

                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={handleCancelEdit}
                              className={`px-3 py-1 rounded ${
                                darkMode
                                  ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                              }`}
                              disabled={isSubmitting}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                handleSaveEdit(diagnoses.id, diagnosis.id)
                              }
                              className={`px-3 py-1 rounded ${
                                darkMode
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Display Diagnosis
                        <>
                          <div
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-800"
                            } flex justify-between items-center`}
                          >
                            <span className="text-lg">
                              {diagnosis.diagnosis_title}
                            </span>
                            <span>{diagnosis.created_at}</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                Since: {diagnosis.start}
                              </span>
                              <button
                                onClick={() => handleEditClick(diagnosis)}
                                className={`text-sm px-2 py-1 rounded ${
                                  darkMode
                                    ? "bg-gray-600 text-blue-300 hover:bg-gray-500"
                                    : "bg-gray-200 text-blue-600 hover:bg-gray-300"
                                }`}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                          {diagnosis.comment && (
                            <p
                              className={`${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              } whitespace-pre-wrap text-sm leading-relaxed mt-1`}
                            >
                              {diagnosis.comment}
                            </p>
                          )}
                        </>
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
