import { useAppSettings } from "../../contextApi/appContext";
import { Phone, Mail, Home, Shield } from "lucide-react";

import { TPatientInfo } from "../../types";

type Tprops = {
  patient: TPatientInfo;

  onPatientUpdate: (patient: TPatientInfo) => void;
  isEdit: boolean;
};

function ContactAndInsurance({ patient, onPatientUpdate, isEdit }: Tprops) {
  const { darkMode } = useAppSettings();
  return (
    <div className="flex">
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} w-1/2 rounded-lg shadow-md p-2 mb-1 transition-colors duration-200`}
      >
        <h3
          className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-lg font-semibold mb-2 flex items-center `}
        >
          <Phone className="mr-2 text-blue-500" size={18} />
          Contact Information
        </h3>
        <div className="space-y-1">
          <div className="flex items-center">
            <Phone
              className={`mr-3 ${darkMode ? "text-blue-300" : "text-blue-700"}`}
              size={16}
            />
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.phone}
                name="phone"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,

                    phone: e.target.value,
                  })
                }
              />
            ) : (
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {patient.phone}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <Mail
              className={`mr-3 ${darkMode ? "text-blue-300" : "text-blue-700"}`}
              size={16}
            />
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.email}
                name="email"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    email: e.target.value,
                  })
                }
              />
            ) : (
              <p className={` ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {patient.email}
              </p>
            )}
          </div>
          <div className="flex items-start">
            <Home
              className={`mr-3 mt-1 ${darkMode ? "text-blue-300" : "text-blue-700"}`}
              size={16}
            />

            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.residence}
                name="residence"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    residence: e.target.value,
                  })
                }
              />
            ) : (
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {patient.residence}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Insurance */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} w-1/2 rounded-lg shadow-md p-2 mb-1 transition-colors duration-200`}
      >
        <h3
          className={` ${darkMode ? "text-gray-400" : "text-gray-500"} text-lg font-semibold mb-1 flex items-center`}
        >
          <Shield className="mr-2 text-yellow-400" size={18} />
          Insurance
        </h3>
        <div className="space-y-1">
          <div className="flex  items-center">
            {isEdit ? (
              <>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  title="Provider"
                >
                  PR:
                </p>
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.insurance_provider}
                  name="provider"
                  onChange={(e) =>
                    onPatientUpdate({
                      ...patient,
                      insurance_provider: e.target.value,
                    })
                  }
                />
              </>
            ) : (
              <>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Provider:
                </p>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}
                >
                  {" "}
                  &nbsp; {patient.insurance_provider}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center">
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              title="Policy Number"
            >
              PN:
            </p>
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.insurance_policy_number}
                name="policyNumber"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    insurance_policy_number: e.target.value,
                  })
                }
              />
            ) : (
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}
              >
                {" "}
                &nbsp; {patient.insurance_policy_number}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              title="Group Number"
            >
              GN:
            </p>
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.insurance_group_number}
                name="golicyNumber"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    insurance_group_number: e.target.value,
                  })
                }
              />
            ) : (
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}
              >
                {" "}
                &nbsp; {patient.insurance_group_number}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactAndInsurance;
