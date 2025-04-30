import { useState, useEffect } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { getDrug } from "../../../utils/drug";
import { TpatientMedicalHistory, TMed } from "../../../types";
import { Pencil, Save, X } from "lucide-react";

type TProps = {
  patientMedicalHistory: TpatientMedicalHistory;
  setPatientMedicalHistory: React.Dispatch<
    React.SetStateAction<TpatientMedicalHistory>
  >;
  originalData: TpatientMedicalHistory;
  onSave: (data: TpatientMedicalHistory) => Promise<void>;
};
function MedicalHistory({
  patientMedicalHistory,
  setPatientMedicalHistory,
  originalData,
  onSave,
}: TProps) {
  const { darkMode } = useAppSettings();
  const [isEdit, setIsEdit] = useState(false);
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
  const [expandedSections, setExpandedSections] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [activeMedicationIndex, setActiveMedicationIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    setConditions(patientMedicalHistory.conditions || []);
    setMedications(patientMedicalHistory.medications || []);
    setAllergies(patientMedicalHistory.allergies || []);
  }, [patientMedicalHistory]);

  // Update parent state when local state changes
  useEffect(() => {
    if (isEdit) {
      setPatientMedicalHistory((prev) => ({
        ...prev,
        special_habits,
        conditions,
        medications,
        allergies,
      }));
    }
  }, [special_habits, conditions, medications, allergies]);

  const toggleSection = () => {
    setExpandedSections((prev) => !prev);
  };

  const handleSave = async () => {
    await onSave(patientMedicalHistory);
    setIsEdit(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setSpecialHabits(originalData.special_habits || []);
    setConditions(originalData.conditions || []);
    setMedications(originalData.medications || []);
    setAllergies(originalData.allergies || []);

    // Also reset the parent state
    setPatientMedicalHistory((prev) => ({
      ...prev,
      special_habits: originalData.special_habits,
      conditions: originalData.conditions,
      medications: originalData.medications,
      allergies: originalData.allergies,
    }));

    setIsEdit(false);
  };

  // Handle medication name input change
  const handleMedicationNameChange = (index: number, value: string) => {
    setActiveMedicationIndex(index);

    // Get drug suggestions
    const matchingDrugs = getDrug(value);
    setSuggestions(matchingDrugs);

    // Update the medication
    const updatedMedications = [...medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      med_name: value,
    };
    setMedications(updatedMedications);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (drugName: string) => {
    if (activeMedicationIndex !== null) {
      const updatedMedications = [...medications];
      updatedMedications[activeMedicationIndex] = {
        ...updatedMedications[activeMedicationIndex],
        med_name: drugName,
      };
      setMedications(updatedMedications);
      setSuggestions([]);
      setActiveMedicationIndex(null);
    }
  };
  const down = <span className="text-green-500">▼</span>;
  const up = <span>▲ </span>;
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} w-full rounded-lg shadow-md p-2 mb-1
      transition-colors duration-200`}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className="flex items-center cursor-pointer"
          onClick={toggleSection}
        >
          <h4
            className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Medical History
          </h4>
          <span className="ml-2 text-gray-400">
            {expandedSections ? down : up}
          </span>
        </div>

        {/* Edit controls */}
        {isEdit ? (
          <div className="flex items-center gap-2">
            <span onClick={handleSave} className="cursor-pointer">
              <Save className="text-green-400 hover:text-green-500" size={22} />
            </span>
            <span onClick={handleCancel} className="cursor-pointer">
              <X className="text-red-400 hover:text-red-500" size={22} />
            </span>
          </div>
        ) : (
          <span
            onClick={() => {
              setIsEdit(true);
              setExpandedSections(true);
            }}
            className="cursor-pointer"
          >
            <Pencil className="text-gray-500 hover:text-green-500" size={20} />
          </span>
        )}
      </div>

      {expandedSections && (
        <div
          className={`border ${
            darkMode
              ? "border-gray-600 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          } p-3 rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col gap-1 max-h-[350px] overflow-y-auto custom-scrollbar`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Allergies section */}
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

            {/* Medications section */}
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
                  {medications.map((medication, index) => {
                    return (
                      <div key={index} className="flex flex-col gap-2 mb-2">
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <input
                              className={`${
                                darkMode
                                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                  : "bg-gray-50 border-gray-300 text-gray-900"
                              } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                              placeholder="Medication name"
                              value={medication.med_name}
                              onChange={(e) =>
                                handleMedicationNameChange(
                                  index,
                                  e.target.value,
                                )
                              }
                              onFocus={() => setActiveMedicationIndex(index)}
                            />

                            {/* Drug suggestions dropdown */}
                            {activeMedicationIndex === index &&
                              suggestions.length > 0 && (
                                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                  {suggestions.map((drug, i) => (
                                    <li
                                      key={i}
                                      className={`text-xs px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${
                                        darkMode
                                          ? "text-gray-200"
                                          : "text-gray-800"
                                      }`}
                                      onClick={() =>
                                        handleSuggestionClick(drug.name)
                                      }
                                    >
                                      {drug.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>

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
                      </div>
                    );
                  })}
                  <button
                    onClick={() =>
                      setMedications([
                        ...medications,
                        { med_name: "", dosage: "" },
                      ])
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
                      {medications.map((med, index) => {
                        if (med.med_name === "") return null;
                        return (
                          <li
                            key={index}
                            className={`${darkMode ? "text-gray-400" : "text-gray-700"} relative group cursor-pointer `}
                          >
                            <span
                              className={`${darkMode ? "group-hover:text-gray-200" : "group-hover:text-black"} text-xs groub-hover:text-gray-500`}
                            >
                              {med.med_name}
                            </span>
                            <div
                              className="absolute left-0 -top-8 hidden group-hover:block bg-gray-800 text-yellow-500
                              text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap"
                            >
                              <span>Dosage:</span> <span>{med.dosage}</span>
                            </div>
                          </li>
                        );
                      })}
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

          {/* Conditions and Special Habits sections remain the same */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Conditions section */}
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

            {/* Special Habits section */}
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
        </div>
      )}
    </div>
  );
}

export default MedicalHistory;
