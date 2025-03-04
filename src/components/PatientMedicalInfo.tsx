import { useState, useEffect } from "react";
import { useAppSettings } from "../contextApi/appContext";
import { TPatientInfo } from "../types";
import { Pencil, Save } from "lucide-react";
import { Pill } from "lucide-react";

type Tprops = {
  patient: TPatientInfo;

  onPatientUpdate: (patient: TPatientInfo) => void;
  onSavePatient: () => void;
};
function PatientMedicalInfo({
  patient,
  onPatientUpdate,
  onSavePatient,
}: Tprops) {
  const { darkMode } = useAppSettings();
  const [isEdit, setIsEdit] = useState(false);
  const [specialHabits, setSpecialHabits] = useState<string[]>(
    patient.specialHabits || [],
  );
  const [conditions, setConditions] = useState<string[]>(
    patient.conditions || [],
  );
  const [medications, setMedications] = useState<string[]>(
    patient.medications || [],
  );
  const [allergies, setAllergies] = useState<string[]>(patient.allergies || []);

  useEffect(() => {
    setSpecialHabits(patient.specialHabits || []);
    setConditions(patient.conditions || []);
    setMedications(patient.medications || []);
    setAllergies(patient.allergies || []);
  }, [patient]);

  const onSaveHandler = () => {
    onPatientUpdate({
      ...patient,
      specialHabits,
      conditions,
      medications,
      allergies,
    });

    onSavePatient();
    setIsEdit(false);
  };
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} h-[100%] w-full  rounded-lg shadow-md p-6 mb-6 transition-colors duration-200`}
    >
      <h3 className=" text-lg font-semibold mb-4 flex items-center">
        <Pill className="mr-2" size={18} />
        <span>Medical Information</span>
        {isEdit ? (
          <span onClick={onSaveHandler} className="cursor-pointer ml-8">
            <Save className="text-green-400" size={35} />
          </span>
        ) : (
          <span
            onClick={() => {
              setIsEdit(!isEdit);
              onSavePatient();
            }}
            className="cursor-pointer ml-8"
          >
            <Pencil className="text-gray-500 hover:text-green-500" size={22} />
          </span>
        )}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4
            className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Allergies
          </h4>
          {isEdit ? (
            <div>
              {allergies.map((allergy, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
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
                  className={`list-disc pl-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
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
            className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Medications
          </h4>
          {isEdit ? (
            <div>
              {medications.map((medication, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                    value={medication}
                    onChange={(e) => {
                      const updatedMedications = [...medications];
                      updatedMedications[index] = e.target.value;
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
                onClick={() => setMedications([...medications, ""])}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Medication
              </button>
            </div>
          ) : (
            <>
              {medications.length > 0 ? (
                <ul
                  className={`list-disc pl-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {medications.map((med, index) => (
                    <li key={index}>{med}</li>
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
            className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Conditions
          </h4>
          {isEdit ? (
            <div>
              {conditions.map((condition, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
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
                  className={`list-disc pl-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
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
            className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Special Habits
          </h4>

          {isEdit ? (
            <div>
              {specialHabits.map((habit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                    value={habit}
                    onChange={(e) => {
                      const updatedHabits = [...specialHabits];
                      updatedHabits[index] = e.target.value;
                      setSpecialHabits(updatedHabits);
                    }}
                  />
                  <button
                    onClick={() => {
                      const updatedHabits = specialHabits.filter(
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
                onClick={() => setSpecialHabits([...specialHabits, ""])}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Habit
              </button>
            </div>
          ) : (
            <>
              {specialHabits.length > 0 ? (
                <ul
                  className={`list-disc pl-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {specialHabits.map((habit, index) => (
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
      <div>
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Past History
        </h4>
        {isEdit ? (
          <textarea
            className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
            value={patient.notes}
            onChange={(e) =>
              onPatientUpdate({ ...patient, notes: e.target.value })
            }
          />
        ) : (
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {patient.notes}
          </p>
        )}
      </div>
      <div>
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Family History
        </h4>
        {isEdit ? (
          <textarea
            className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
            value={patient.notes}
            onChange={(e) =>
              onPatientUpdate({ ...patient, notes: e.target.value })
            }
          />
        ) : (
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {patient.notes}
          </p>
        )}
      </div>
      <div>
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Notes
        </h4>
        {isEdit ? (
          <textarea
            className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
            value={patient.notes}
            onChange={(e) =>
              onPatientUpdate({ ...patient, notes: e.target.value })
            }
          />
        ) : (
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {patient.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export default PatientMedicalInfo;
