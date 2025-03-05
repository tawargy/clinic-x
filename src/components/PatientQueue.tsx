import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, X, Heart, Activity, Pill, Clipboard } from "lucide-react";
import { useAppSettings } from "../contextApi/appContext";
import { Patient } from "../types";

interface PatientQueueProps {
  patients: Patient[];
}

const PatientQueue: React.FC<PatientQueueProps> = ({ patients }) => {
  const [hoveredPatientId, setHoveredPatientId] = useState<number | null>(null);
  const { darkMode } = useAppSettings();
  const navigate = useNavigate();
  const formatWaitTime = (checkInTime: string) => {
    const waitTimeMinutes = Math.floor(
      (Date.now() - new Date(checkInTime).getTime()) / 60000,
    );

    if (waitTimeMinutes < 60) {
      return `${waitTimeMinutes} min`;
    } else {
      const hours = Math.floor(waitTimeMinutes / 60);
      const minutes = waitTimeMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  // Dummy data for patient details
  const getPatientDetails = (patientId: number) => {
    const details: Record<
      number,
      {
        bloodPressure: string;
        heartRate: string;
        temperature: string;
        allergies: string;
        medications: string;
      }
    > = {
      1: {
        bloodPressure: "120/80",
        heartRate: "72 bpm",
        temperature: "98.6°F",
        allergies: "Penicillin",
        medications: "Lisinopril, Metformin",
      },
      2: {
        bloodPressure: "118/75",
        heartRate: "68 bpm",
        temperature: "98.2°F",
        allergies: "None",
        medications: "Atorvastatin",
      },
      3: {
        bloodPressure: "135/85",
        heartRate: "78 bpm",
        temperature: "99.1°F",
        allergies: "Sulfa drugs",
        medications: "Amlodipine, Aspirin",
      },
      4: {
        bloodPressure: "110/70",
        heartRate: "65 bpm",
        temperature: "98.4°F",
        allergies: "Latex",
        medications: "None",
      },
      5: {
        bloodPressure: "145/90",
        heartRate: "82 bpm",
        temperature: "98.8°F",
        allergies: "Shellfish",
        medications: "Metoprolol, Furosemide",
      },
    };

    // Generate random data for patients without specific details
    if (!details[patientId]) {
      const systolic = 100 + Math.floor(Math.random() * 50);
      const diastolic = 60 + Math.floor(Math.random() * 30);
      const heartRate = 60 + Math.floor(Math.random() * 30);
      const tempBase = 97.5 + Math.random() * 2;
      const temperature = tempBase.toFixed(1);

      const allergies = [
        "None",
        "Penicillin",
        "Sulfa drugs",
        "Latex",
        "Shellfish",
        "Peanuts",
        "Dairy",
      ];
      const medications = [
        "None",
        "Lisinopril",
        "Metformin",
        "Atorvastatin",
        "Amlodipine",
        "Metoprolol",
        "Levothyroxine",
        "Omeprazole",
        "Albuterol",
        "Gabapentin",
      ];

      const randomAllergy =
        allergies[Math.floor(Math.random() * allergies.length)];
      let randomMeds = "";

      // 30% chance of having no medications
      if (Math.random() > 0.3) {
        const numMeds = 1 + Math.floor(Math.random() * 3); // 1-3 medications
        const selectedMeds = [];

        for (let i = 0; i < numMeds; i++) {
          const med =
            medications[
              1 + Math.floor(Math.random() * (medications.length - 1))
            ]; // Skip "None"
          if (!selectedMeds.includes(med)) {
            selectedMeds.push(med);
          }
        }

        randomMeds = selectedMeds.join(", ");
      } else {
        randomMeds = "None";
      }

      return {
        bloodPressure: `${systolic}/${diastolic}`,
        heartRate: `${heartRate} bpm`,
        temperature: `${temperature}°F`,
        allergies: randomAllergy,
        medications: randomMeds,
      };
    }

    return details[patientId];
  };

  const onPatientClick = (patientId: number) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
      {patients.length === 0 ? (
        <div
          className={`text-center py-8 ${darkMode ? "text-gray-400" : " text-gray-500"} transition-colors duration-200`}
        >
          <p>No patients in queue</p>
        </div>
      ) : (
        <ul
          className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"} transition-colors duration-200`}
        >
          {patients.map((patient) => {
            const isHovered = hoveredPatientId === patient.id;
            const patientDetails = getPatientDetails(patient.id);

            return (
              <li
                key={patient.id}
                className={`cursor-pointer py-3 flex flex-col justify-between ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} px-2 rounded transition-colors duration-200 relative`}
                onMouseEnter={() => setHoveredPatientId(patient.id)}
                onMouseLeave={() => setHoveredPatientId(null)}
                onClick={() => onPatientClick(patient.id)}
              >
                <div className="flex justify-between w-full">
                  <div>
                    <h3 className="font-medium">{patient.name}</h3>
                    <div
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center transition-colors duration-200`}
                    >
                      <span className="mr-3">New {patient.age}</span>
                      {patient.checkInTime && (
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          Wait: {formatWaitTime(patient.checkInTime)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Patient details card that appears on hover */}
                {isHovered && (
                  <div
                    className={`${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    } border rounded-md p-3 mt-2 shadow-lg transition-all duration-200 z-10`}
                  >
                    <h4 className="font-medium mb-2">Patient Details</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center">
                        <Heart
                          className={`mr-2 ${darkMode ? "text-red-400" : "text-red-500"}`}
                          size={16}
                        />
                        <span
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <span className="font-medium">BP:</span>{" "}
                          {patientDetails.bloodPressure}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Activity
                          className={`mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                          size={16}
                        />
                        <span
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <span className="font-medium">Heart Rate:</span>{" "}
                          {patientDetails.heartRate}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clipboard
                          className={`mr-2 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
                          size={16}
                        />
                        <span
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <span className="font-medium">Temp:</span>{" "}
                          {patientDetails.temperature}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <Pill
                          className={`mr-2 mt-0.5 ${darkMode ? "text-purple-400" : "text-purple-500"}`}
                          size={16}
                        />
                        <div className="flex flex-col">
                          <span
                            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            <span className="font-medium">Medications:</span>{" "}
                            {patientDetails.medications}
                          </span>
                          <span
                            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} mt-1`}
                          >
                            <span className="font-medium">Allergies:</span>{" "}
                            {patientDetails.allergies}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PatientQueue;
