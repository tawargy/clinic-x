import { useState } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import { TAppointment } from "../../types";
import { History, Calendar } from "lucide-react";
import { formatDateDB } from "../../utils/date";
import Visit from "./Visit";

type Tprops = {
  appointments: TAppointment[];
};
function PatientVisitHistory({ appointments }: Tprops) {
  const { darkMode } = useAppSettings();
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [visitId, setVisitId] = useState("");

  const onOpenVisitHandler = (id: string) => {
    console.log("id", id);
    setIsVisitOpen(true);
    setVisitId(id);
  };
  const onCloseVisitHandler = () => {
    setIsVisitOpen(!isVisitOpen);
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} w-full rounded-lg shadow-md mt-4  transition-colors duration-200`}
    >
      {isVisitOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50  z-50 ">
          <Visit appointment_id={visitId} onClose={onCloseVisitHandler} />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-500">
        <History className="mr-2 text-green-700" size={18} />
        Visits History
      </h3>

      {appointments.length > 0 ? (
        <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          {appointments.map((visit, index) => (
            <div
              key={index}
              className={`${darkMode ? "border-gray-700" : "border-gray-200"} border-l-4 pl-4 ${
                index !== appointments.length - 1 ? "pb-6" : ""
              }`}
            >
              <div className="flex items-center mb-2 ">
                <Calendar
                  className={`mr-2 ${darkMode ? "text-green-700" : "text-green-300"}`}
                  size={16}
                />
                <p
                  className={`${darkMode ? "text-green-300" : "text-green-700"} cursor-pointer font-medium hover:text-blue-400`}
                  onClick={() => onOpenVisitHandler(visit.id)}
                >
                  {formatDateDB(visit.created_at)}
                </p>
              </div>
              <div className=" gap-4">
                <div>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Complaint:
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {visit.complaint}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Provisional Diagnosis:
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {visit.provisional_diagnosis}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          No visit history available
        </p>
      )}
    </div>
  );
}

export default PatientVisitHistory;
