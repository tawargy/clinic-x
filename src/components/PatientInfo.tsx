import { useState } from "react";
import { useAppSettings } from "../contextApi/appContext";
import { TPatientInfo } from "../types";
import {
  User,
  Heart,
  Activity,
  Clipboard,
  Phone,
  Mail,
  Home,
  Shield,
  Pencil,
  Save,
} from "lucide-react";

type Tprops = {
  patient: TPatientInfo;
  onOpenViset: () => void;
  onSchedule: () => void;
  onPatientUpdate: (patient: TPatientInfo) => void;
  onSavePatient: () => void;
};

function PatientInfo({
  patient,
  onOpenViset,
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
            <div className="flex flex-col gap-2">
              <button
                className="bg-green-500 text-white py-1  px-2 rounded-md hover:bg-green-700"
                onClick={() => onOpenViset()}
              >
                Oppen Visit
              </button>
              <button
                className="bg-purple-500 text-white text-sm py-2  px-2 rounded-md hover:bg-purple-700"
                onClick={() => onSchedule()}
              >
                Schedule Visit
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}
          >
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1`}
            >
              Height
            </p>
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.height}
                name="height"
                onChange={(e) =>
                  onPatientUpdate({ ...patient, height: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{patient.height}</p>
            )}
          </div>
          <div
            className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}
          >
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1`}
            >
              Weight
            </p>
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.weight}
                name="weight"
                onChange={(e) =>
                  onPatientUpdate({ ...patient, weight: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{patient.weight}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Heart
              className={`mr-3 ${darkMode ? "text-red-400" : "text-red-500"}`}
              size={20}
            />
            <div>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Blood Pressure
              </p>
              {isEdit ? (
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.bloodPressure}
                  name="bloodPressure"
                  onChange={(e) =>
                    onPatientUpdate({
                      ...patient,
                      bloodPressure: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="font-medium">{patient.bloodPressure} mmHg</p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Activity
              className={`mr-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
              size={20}
            />
            <div>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Heart Rate
              </p>
              {isEdit ? (
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.heartRate}
                  name="heartRate"
                  onChange={(e) =>
                    onPatientUpdate({ ...patient, heartRate: e.target.value })
                  }
                />
              ) : (
                <p className="font-medium">{patient.heartRate} bpm</p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Clipboard
              className={`mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
              size={20}
            />
            <div>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Temperature
              </p>
              {isEdit ? (
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.temperature}
                  name="temperature"
                  onChange={(e) =>
                    onPatientUpdate({ ...patient, temperature: e.target.value })
                  }
                />
              ) : (
                <p className="font-medium">{patient.temperature} °C</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 mb-6 transition-colors duration-200`}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Phone className="mr-2" size={18} />
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Phone
              className={`mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              size={16}
            />
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.contactInfo.phone}
                name="phone"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    contactInfo: {
                      ...patient.contactInfo,
                      phone: e.target.value,
                    },
                  })
                }
              />
            ) : (
              <p>{patient.contactInfo.phone}</p>
            )}
          </div>
          <div className="flex items-center">
            <Mail
              className={`mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              size={16}
            />
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.contactInfo.email}
                name="email"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    contactInfo: {
                      ...patient.contactInfo,
                      email: e.target.value,
                    },
                  })
                }
              />
            ) : (
              <p>{patient.contactInfo.email}</p>
            )}
          </div>
          <div className="flex items-start">
            <Home
              className={`mr-3 mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              size={16}
            />

            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.contactInfo.address}
                name="address"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    contactInfo: {
                      ...patient.contactInfo,
                      address: e.target.value,
                    },
                  })
                }
              />
            ) : (
              <p>{patient.contactInfo.address}</p>
            )}
          </div>
        </div>
      </div>

      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 transition-colors duration-200`}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="mr-2" size={18} />
          Insurance
        </h3>
        <div className="space-y-3">
          <div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Provider
            </p>
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.insurance.provider}
                name="provider"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    insurance: {
                      ...patient.insurance,
                      provider: e.target.value,
                    },
                  })
                }
              />
            ) : (
              <p className="font-medium">{patient.insurance.provider}</p>
            )}
          </div>
          <div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Policy Number
            </p>
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.insurance.policyNumber}
                name="policyNumber"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    insurance: {
                      ...patient.insurance,
                      policyNumber: e.target.value,
                    },
                  })
                }
              />
            ) : (
              <p className="font-medium">{patient.insurance.policyNumber}</p>
            )}
          </div>
          <div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Group Number
            </p>
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.insurance.groupNumber}
                name="golicyNumber"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    insurance: {
                      ...patient.insurance,
                      groupNumber: e.target.value,
                    },
                  })
                }
              />
            ) : (
              <p className="font-medium">{patient.insurance.groupNumber}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientInfo;
