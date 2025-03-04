import { useState } from "react";
import { useAppSettings } from "../contextApi/appContext";
import { Phone, Mail, Home, Shield } from "lucide-react";

import { TPatientInfo } from "../types";

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
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Phone className="mr-2" size={18} />
          Contact Information
        </h3>
        <div className="space-y-1">
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
      {/* Insurance */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} w-1/2 rounded-lg shadow-md p-2 mb-1 transition-colors duration-200`}
      >
        <h3 className="text-lg font-semibold mb-1 flex items-center">
          <Shield className="mr-2" size={18} />
          Insurance
        </h3>
        <div className="space-y-1">
          <div className="flex  items-center">
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Provider:
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
              <p className="font-medium">
                {" "}
                &nbsp; {patient.insurance.provider}
              </p>
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
              <p className="font-medium">
                {" "}
                &nbsp; {patient.insurance.policyNumber}
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
              <p className="font-medium">
                {" "}
                &nbsp; {patient.insurance.groupNumber}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactAndInsurance;
