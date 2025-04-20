import { useEffect, useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import InfoCard from "./InfoCard";
import { TAppointment, TDiagnosis } from "../../../types";
import { useDiagnosis } from "../../../hooks/useDiagnosis";
import { updateDiagnosisApi } from "../../../api/diagnosis";

import {
  AlertCircle,
  Activity,
  FileText,
  Stethoscope,
  Edit2,
  Check,
  X,
} from "lucide-react";

type TProps = {
  appointment: TAppointment;
};

function DetailsTab({ appointment }: TProps) {
  const { darkMode } = useAppSettings();
  const { diagnoses, setDiagnosesId, setDiagnoses } = useDiagnosis();
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
    diagnosis_type: "acute",
    start: "",
    end: "",
    comment: "",
  });

  useEffect(() => {
    setDiagnosesId(appointment.provisional_diagnosis);
  }, [appointment.provisional_diagnosis]);

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

  const handleCancelEdit = () => {
    setEditingDiagnosis(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (diagnosisId: string) => {
    if (!diagnoses) return;

    setIsSubmitting(true);

    // First, create the updated diagnoses object
    const updatedDiagnoses = {
      ...diagnoses,
      diagnoses: diagnoses.diagnoses.map((d) => {
        if (d.id === diagnosisId) {
          return {
            ...d,
            ...editFormData,
          };
        }
        return d;
      }),
    };

    // Update UI immediately (optimistic update)
    setDiagnoses(updatedDiagnoses);

    try {
      // Then update in the database
      const success = await updateDiagnosisApi(
        diagnoses.id,
        diagnosisId,
        editFormData,
      );

      if (!success) {
        // If API call fails, revert to original data
        setDiagnosesId(diagnoses.id); // This will trigger a refresh
      }

      setEditingDiagnosis(null);
    } catch (error) {
      console.error("Error updating diagnosis:", error);
      // Revert to original data on error
      setDiagnosesId(diagnoses.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSaveEdit = async (diagnosisId: string) => {
  //   if (!diagnoses) return;

  //   setIsSubmitting(true);
  //   try {
  //     // Update diagnosis with API
  //     const success = await updateDiagnosisApi(
  //       diagnoses.id,
  //       diagnosisId,
  //       editFormData,
  //     );

  //     if (success) {
  //       // Refresh the diagnoses instead of using setDiagnoses
  //       setDiagnosesId(diagnoses.id); // This will trigger the useEffect in useDiagnosis
  //       setEditingDiagnosis(null);
  //     }
  //   } catch (error) {
  //     console.error("Error updating diagnosis:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar pr-2 h-full">
      <div className="space-y-6 max-h-[380px] overflow-y-auto custom-scrollbar">
        <InfoCard
          title="Complaint"
          content={appointment.complaint}
          icon={<AlertCircle size={18} />}
          darkMode={darkMode}
        />
        <InfoCard
          title="Present Health Problems"
          content={appointment.present_history}
          icon={<Activity size={18} />}
          darkMode={darkMode}
        />
        <InfoCard
          title="Examination"
          content={appointment.examination}
          icon={<Stethoscope size={18} />}
          darkMode={darkMode}
        />
      </div>

      <div>
        <div
          className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4 mb-6`}
        >
          <h3
            className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}
          >
            <FileText size={18} className="mr-2" />
            Diagnoses
          </h3>
          <div className="space-y-3 max-h-[418px] overflow-y-auto custom-scrollbar">
            {diagnoses &&
              diagnoses.diagnoses.map((d) => {
                if (!d.diagnosis_title) return null;
                return (
                  <div
                    key={d.id}
                    className={`border ${
                      darkMode
                        ? "border-gray-600 bg-gray-800"
                        : "border-gray-200 bg-gray-50"
                    } p-3 rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col gap-1`}
                  >
                    {editingDiagnosis === d.id ? (
                      // Edit Form
                      <div className="flex flex-col gap-2">
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              darkMode ? "text-gray-200" : "text-gray-700"
                            } mb-1`}
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
                            className={`block text-sm font-medium ${
                              darkMode ? "text-gray-200" : "text-gray-700"
                            } mb-1`}
                          >
                            Type
                          </label>
                          <select
                            name="diagnosis_type"
                            value={editFormData.diagnosis_type}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border text-black"
                          >
                            <option value="acute">Acute</option>
                            <option value="chronic">Chronic</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label
                              className={`block text-sm font-medium ${
                                darkMode ? "text-gray-200" : "text-gray-700"
                              } mb-1`}
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
                              className={`block text-sm font-medium ${
                                darkMode ? "text-gray-200" : "text-gray-700"
                              } mb-1`}
                            >
                              End Date
                            </label>
                            <input
                              type="date"
                              name="end"
                              value={editFormData.end}
                              onChange={handleInputChange}
                              className={`w-full p-2 rounded border ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              darkMode ? "text-gray-200" : "text-gray-700"
                            } mb-1`}
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
                            className={`p-1 rounded-full ${
                              darkMode
                                ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            } flex items-center justify-center`}
                            disabled={isSubmitting}
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                          <button
                            onClick={() => handleSaveEdit(d.id)}
                            className={`p-1 rounded-full ${
                              darkMode
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            } flex items-center justify-center`}
                            disabled={isSubmitting}
                            title="Save"
                          >
                            <Check size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Diagnosis
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <p
                              className={`font-medium ${darkMode ? "text-white" : "text-gray-800"} flex gap-4 items-center`}
                            >
                              <span
                                className={`${d.diagnosis_type === "acute" ? "text-blue-400" : "text-yellow-500"} text-sm`}
                              >
                                {d.diagnosis_type}
                              </span>
                              <span
                                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} flex gap-2 mt-1`}
                              >
                                <span>[{d.start}</span>
                                <span>:</span>
                                <span>{d.end || "present"}]</span>
                              </span>
                            </p>
                            <p
                              className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} flex gap-4`}
                            >
                              {d.diagnosis_title}
                            </p>
                          </div>
                          <button
                            onClick={() => handleEditClick(d)}
                            className={`text-sm p-1 rounded-full ${
                              darkMode
                                ? "bg-gray-600 text-blue-300 hover:bg-gray-500"
                                : "bg-gray-200 text-blue-600 hover:bg-gray-300"
                            } flex items-center justify-center`}
                            title="Edit diagnosis"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                        {d.comment && (
                          <p
                            className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed mt-1`}
                          >
                            {d.comment}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsTab;
