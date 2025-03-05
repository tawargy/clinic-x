import { useState } from "react";
import { useAppSettings } from "../contextApi/appContext";
import { TPatientInfo } from "../types";
import ContactAndInsurance from "./ContactAndInsurance";
import { User, Pencil, Save } from "lucide-react";
import Vitals from "./Vitals";

import PatientVisitHistory from "../components/PatientVisitHistory";

type Tprops = {
  patient: TPatientInfo;
  onSchedule: () => void;
  onPatientUpdate: (patient: TPatientInfo) => void;
  onSavePatient: () => void;
};

function PatientInfo({
  patient,
  onSchedule,
  onPatientUpdate,
  onSavePatient,
}: Tprops) {
  const [isEdit, setIsEdit] = useState(false);

  const { darkMode } = useAppSettings();

  return (
    <div className="lg:col-span-1">
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-1 mb-2 transition-colors duration-200`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div
              className={`${darkMode ? "bg-blue-900" : "bg-blue-100"} p-3 rounded-full mr-4`}
            >
              <User
                className={`${darkMode ? "text-blue-300" : "text-blue-600"}`}
                size={24}
              />
            </div>
            <div>
              <h2 className="flex items-center text-2xl font-bold">
                {isEdit ? (
                  <input
                    className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                    type="text"
                    value={patient.name}
                    name="name"
                    onChange={(e) =>
                      onPatientUpdate({ ...patient, name: e.target.value })
                    }
                  />
                ) : (
                  <>
                    {patient.name}
                    <span
                      onClick={() => setIsEdit(!isEdit)}
                      className="cursor-pointer ml-8"
                    >
                      {!isEdit && (
                        <Pencil
                          className="text-gray-500 hover:text-green-500"
                          size={22}
                        />
                      )}
                    </span>
                  </>
                )}
              </h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {patient.age} years • {patient.gender} • Born city:{" "}
                {patient.bornCity}
              </p>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {patient.marital} • {patient.occupation}
              </p>
            </div>
          </div>
          {isEdit ? (
            <span
              onClick={() => {
                onSavePatient();
                setIsEdit(!isEdit);
              }}
              className="cursor-pointer"
            >
              <Save className="text-green-400" size={35} />
            </span>
          ) : (
            <button
              className="bg-purple-500 text-white text-sm py-2  px-2 rounded-md hover:bg-purple-700"
              onClick={() => onSchedule()}
            >
              Schedule Visit
            </button>
          )}
        </div>
      </div>
      <Vitals
        patient={patient}
        onPatientUpdate={onPatientUpdate}
        isEdit={isEdit}
      />
      <ContactAndInsurance
        patient={patient}
        onPatientUpdate={onPatientUpdate}
        isEdit={isEdit}
      />

      <PatientVisitHistory patient={patient} />
    </div>
  );
}

export default PatientInfo;
