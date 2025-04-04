import { useState, useEffect } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import { patientMedicalHistoryInit } from "../../initData";
import { invoke } from "@tauri-apps/api/core";
import { toastError, toastSuccess } from "../../utils/toastify";
import { TpatientMedicalHistory, TMed } from "../../types";

import { Pencil, Save, X, Pill } from "lucide-react";
import PatientColLayout from "../../layouts/PatientColLayout";

type Tprops = {
  id: string | undefined;
};
function PatientMedicalInfo({ id }: Tprops) {
  const { darkMode } = useAppSettings();
  const [isEdit, setIsEdit] = useState(false);
  const [isPatientMedicalHistory, setIsPatientMedicalHistory] = useState(false);
  const [originalPatientMedicalHistory, setOriginalPatientMedicalHistory] =
    useState<TpatientMedicalHistory>(patientMedicalHistoryInit);
  const [patientMedicalHistory, setPatientMedicalHistory] =
    useState<TpatientMedicalHistory>(patientMedicalHistoryInit);

  const [special_habits, setSpecialHabits] = useState<string[]>(
    patientMedicalHistory.special_habits || [],
  );
  const [conditions, setConditions] = useState<string[]>(
    patientMedicalHistory.conditions || [],
  );
  const [medications, setMedications] = useState<TMed[]>(
    patientMedicalHistory.medications || [],
  );
  const [allergies, setAllergies] = useState<string[]>(
    patientMedicalHistory.allergies || [],
  );

  useEffect(() => {
    setSpecialHabits(patientMedicalHistory.special_habits || []);
    setConditions(patientMedicalHistory.conditions || []);
    setMedications(patientMedicalHistory.medications || []);
    setAllergies(patientMedicalHistory.allergies || []);
  }, [patientMedicalHistory]);

  const getPatientMedicalHistory = async () => {
    try {
      const res = (await invoke("get_patient_medical_history", {
        id,
      })) as TpatientMedicalHistory;
      if (res.id === "") return;

      setPatientMedicalHistory(res);
      setOriginalPatientMedicalHistory(res);
      setIsPatientMedicalHistory(true);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getPatientMedicalHistory();
  }, []);

  const addPatientMedicalHistory = async (data: TpatientMedicalHistory) => {
    try {
      const res = (await invoke("add_patient_medical_history", {
        id,
        data,
      })) as TpatientMedicalHistory;
      toastSuccess("Medical History Added Successfully");
      console.log("add", res);
    } catch (e) {
      toastError("Error Adding Medical History");
      console.log("add", e);
    }
  };
  const updatePatientMedicalHistory = async (data: TpatientMedicalHistory) => {
    console.log("data update", data);
    try {
      const res = (await invoke("update_patient_medical_history", {
        data,
      })) as TpatientMedicalHistory;
      toastSuccess("Medical History Updated Successfully");
      console.log("update", res);
    } catch (e) {
      toastError("Error Updating Medical History");
      console.log("update", e);
    }
  };

  const onSaveHandler = () => {
    const updatedMedicalHistory = {
      ...patientMedicalHistory,
      id: patientMedicalHistory.id,
      patient_id: id || "", // Make sure patient_id is included
      special_habits,
      conditions,
      medications,
      allergies,
    };
    if (isPatientMedicalHistory) {
      updatePatientMedicalHistory(updatedMedicalHistory);
    } else {
      addPatientMedicalHistory(updatedMedicalHistory);
    }
    setIsEdit(false);
  };
  const onCancelUpdate = () => {
    setPatientMedicalHistory(originalPatientMedicalHistory);
    setIsEdit(false);
  };
  return (
    <PatientColLayout>
      <div className=" text-lg font-semibold mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 ">
          <Pill className="mr-2 text-green-500" size={18} />
          <span>Medical Information</span>
        </h3>

        {isEdit ? (
          <div className="flex items-center gap-2">
            <span onClick={onSaveHandler} className="cursor-pointer ml-8">
              <Save className="text-green-400" size={35} />
            </span>
            <span onClick={onCancelUpdate} className="cursor-pointer">
              <X className="text-red-400" size={35} />
            </span>
          </div>
        ) : (
          <span
            onClick={() => {
              setIsEdit(!isEdit);
            }}
            className="cursor-pointer ml-8"
          >
            <Pencil className="text-gray-500 hover:text-green-500" size={22} />
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4
            className={`text-lg font-medium mb-1 mt-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Allergies
          </h4>
          {isEdit ? (
            <div>
              {allergies.map((allergy, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className={`${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                    value={allergy}
                    onChange={(e) => {
                      const updatedAllergies = [...allergies];
                      updatedAllergies[index] = e.target.value;
                      setAllergies(updatedAllergies);
                    }}
                  />
                  <button
                    onClick={() => {
                      const updatedAllergies = allergies.filter(
                        (_, i) => i !== index,
                      );
                      setAllergies(updatedAllergies);
                    }}
                    className="px-3 py-2 text-red-500 hover:text-red-700 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => setAllergies([...allergies, ""])}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Allergy
              </button>
            </div>
          ) : (
            <>
              {allergies.length > 0 ? (
                <ul
                  className={`list-disc pl-5 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {allergies.map((allergy, index) => (
                    <li key={index}>{allergy}</li>
                  ))}
                </ul>
              ) : (
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  None
                </p>
              )}
            </>
          )}
        </div>

        <div>
          <h4
            className={`text-lg font-medium mb-1 mt-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Medications
          </h4>
          {isEdit ? (
            <div>
              {medications.map((medication, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className={`${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                    placeholder="Medication name"
                    value={medication.med_name}
                    onChange={(e) => {
                      const updatedMedications = [...medications];
                      updatedMedications[index] = {
                        ...updatedMedications[index],
                        med_name: e.target.value,
                      };
                      setMedications(updatedMedications);
                    }}
                  />
                  <input
                    className={`${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                    placeholder="Dosage"
                    value={medication.dosage}
                    onChange={(e) => {
                      const updatedMedications = [...medications];
                      updatedMedications[index] = {
                        ...updatedMedications[index],
                        dosage: e.target.value,
                      };
                      setMedications(updatedMedications);
                    }}
                  />
                  <button
                    onClick={() => {
                      const updatedMedications = medications.filter(
                        (_, i) => i !== index,
                      );
                      setMedications(updatedMedications);
                    }}
                    className="px-3 py-2 text-red-500 hover:text-red-700 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setMedications([...medications, { med_name: "", dosage: "" }])
                }
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Medication
              </button>
            </div>
          ) : (
            <>
              {medications.length > 0 ? (
                <ul
                  className={`list-disc pl-5 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {medications.map((med, index) => (
                    <li
                      key={index}
                      className="relative group cursor-pointer hover:text-yellow-400"
                    >
                      {/* {med.med_name} - {med.dosage} */}
                      <span>{med.med_name}</span>
                      {/* Tooltip */}
                      <div className="absolute left-0 -top-8 hidden group-hover:block bg-gray-800 text-yellow-500 text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        {med.dosage}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  None
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="mb-6">
          <h4
            className={`text-lg font-medium mb-1 mt-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Conditions
          </h4>
          {isEdit ? (
            <div>
              {conditions.map((condition, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className={`${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                    value={condition}
                    onChange={(e) => {
                      const updatedConditions = [...conditions];
                      updatedConditions[index] = e.target.value;
                      setConditions(updatedConditions);
                    }}
                  />
                  <button
                    onClick={() => {
                      const updatedConditions = conditions.filter(
                        (_, i) => i !== index,
                      );
                      setConditions(updatedConditions);
                    }}
                    className="px-3 py-2 text-red-500 hover:text-red-700 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => setConditions([...conditions, ""])}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Condition
              </button>
            </div>
          ) : (
            <>
              {conditions.length > 0 ? (
                <ul
                  className={`list-disc pl-5 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              ) : (
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  No conditions reported
                </p>
              )}
            </>
          )}
        </div>
        <div>
          <h4
            className={`text-lg font-medium mb-1 mt-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Special Habits
          </h4>

          {isEdit ? (
            <div>
              {special_habits.map((habit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className={`${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                    value={habit}
                    onChange={(e) => {
                      const updatedHabits = [...special_habits];
                      updatedHabits[index] = e.target.value;
                      setSpecialHabits(updatedHabits);
                    }}
                  />
                  <button
                    onClick={() => {
                      const updatedHabits = special_habits.filter(
                        (_, i) => i !== index,
                      );
                      setSpecialHabits(updatedHabits);
                    }}
                    className="px-3 py-2 text-red-500 hover:text-red-700 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => setSpecialHabits([...special_habits, ""])}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Habit
              </button>
            </div>
          ) : (
            <>
              {special_habits.length > 0 ? (
                <ul
                  className={`list-disc pl-5 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {special_habits.map((habit, index) => (
                    <li key={index}>{habit}</li>
                  ))}
                </ul>
              ) : (
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  No special habits reported
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className={`border-b border-t ${
          darkMode ? "border-gray-500" : "border-gray-200"
        } py-4`}
      >
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Past History
        </h4>
        {isEdit ? (
          <textarea
            className={`${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-900"
            } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
            value={patientMedicalHistory.past_history}
            onChange={(e) =>
              setPatientMedicalHistory({
                ...patientMedicalHistory,
                past_history: e.target.value,
              })
            }
          />
        ) : (
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {patientMedicalHistory.past_history}
          </p>
        )}
      </div>
      <div
        className={`border-b  ${
          darkMode ? "border-gray-500" : "border-gray-200"
        } py-4`}
      >
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Family History
        </h4>
        {isEdit ? (
          <textarea
            className={`${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-900"
            } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
            value={patientMedicalHistory.family_history}
            onChange={(e) =>
              setPatientMedicalHistory({
                ...patientMedicalHistory,
                family_history: e.target.value,
              })
            }
          />
        ) : (
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {patientMedicalHistory.family_history}
          </p>
        )}
      </div>
      <div>
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Notes
        </h4>
        {isEdit ? (
          <textarea
            className={`${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-900"
            } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
            value={patientMedicalHistory.notes}
            onChange={(e) =>
              setPatientMedicalHistory({
                ...patientMedicalHistory,
                notes: e.target.value,
              })
            }
          />
        ) : (
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {patientMedicalHistory.notes}
          </p>
        )}
      </div>
    </PatientColLayout>
  );
}

export default PatientMedicalInfo;
