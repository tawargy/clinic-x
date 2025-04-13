import { useState, useEffect } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { TpatientMedicalHistory, TMed } from "../../../types";
type TProps = {
  isEdit: boolean;
  patientMedicalHistory: TpatientMedicalHistory;
  setPatientMedicalHistory: React.Dispatch<
    React.SetStateAction<TpatientMedicalHistory>
  >;
};
function MedicalHistory({
  isEdit,
  patientMedicalHistory,
  setPatientMedicalHistory,
}: TProps) {
  const { darkMode } = useAppSettings();
  const [special_habits, setSpecialHabits] = useState<string[]>(
    patientMedicalHistory.special_habits || [],
  );
  const [conditions, setConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<TMed[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState(true);

  useEffect(() => {
    setConditions(patientMedicalHistory.conditions || []);
    setMedications(patientMedicalHistory.medications || []);
    setAllergies(patientMedicalHistory.allergies || []);
  }, []);
  // Update parent state when local state changes
  useEffect(() => {
    setPatientMedicalHistory((prev) => ({
      ...prev,
      special_habits,
      conditions,
      medications,
      allergies,
    }));
  }, [special_habits, conditions, medications, allergies]);

  const toggleSection = () => {
    setExpandedSections((prev) => !prev);
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} w-full rounded-lg shadow-md p-2 mb-1

        transition-colors duration-200`}
    >
      <div
        className="flex items-center cursor-pointer mb-2"
        onClick={() => toggleSection()}
      >
        <h4
          className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Medical History
        </h4>
        <span className="ml-2 text-gray-400">
          {expandedSections ? "▼" : "▲"}
        </span>
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
                  {medications.map((medication, index) => {
                    return (
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
                        if (med.med_name === "") return <span>None</span>;
                        return (
                          <li
                            key={index}
                            className="relative group cursor-pointer hover:text-yellow-400"
                          >
                            <span>{med.med_name}</span>
                            <div className="absolute left-0 -top-8 hidden group-hover:block bg-gray-800 text-yellow-500 text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap">
                              {med.dosage}
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
        </div>
      )}
    </div>
  );
}

export default MedicalHistory;
