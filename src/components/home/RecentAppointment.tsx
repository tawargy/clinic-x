import { useEffect, useState } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import { TPatientInfo } from "../../types";
import {
  Phone,
  BriefcaseMedical,
  Clipboard,
  Activity,
  UserRound,
  Wallet,
} from "lucide-react";
import { getAppointmentFeesByDateApi } from "../../api/appointmentFees";
import { formatDate } from "../../utils/date";
import { TAppointmentFees } from "../../types";
type TProps = {
  patients: TPatientInfo[];
};
const appointmentFeesInit: TAppointmentFees = {
  id: "",
  patient_id: "",
  patient_name: "",
  patient_phone: "",
  appointment_type: "",
  fee: "",
  services: [],
  total_fees: "",
  date: "",
};
function RecentAppointment({ patients }: TProps) {
  const { darkMode } = useAppSettings();
  const [finshAppointments, setFinshAppointment] = useState<TAppointmentFees[]>(
    [appointmentFeesInit],
  );
  const [hoveredPatientId, setHoveredPatientId] = useState<string | undefined>(
    "",
  );
  const getAppointmentFees = async () => {
    try {
      const res = await getAppointmentFeesByDateApi(formatDate(new Date()));
      res && setFinshAppointment(res);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAppointmentFees();
  }, []);
  return (
    <div>
      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
          {finshAppointments.length === 0 ? (
            <div
              className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"} `}
            >
              <p>No recent appointment</p>
            </div>
          ) : (
            <ul
              className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"} `}
            >
              {finshAppointments.map((app) => {
                const isHovered = hoveredPatientId === app.id;
                return (
                  <li
                    key={app.id}
                    className={`cursor-pointer py-3 flex flex-col justify-between ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} px-2 rounded  relative`}
                    onMouseEnter={() => setHoveredPatientId(app.id)}
                    onMouseLeave={() => setHoveredPatientId("")}
                  >
                    <div className="flex justify-between w-full">
                      <div>
                        <h3 className="font-medium pb-2 flex items-center gap-2 ">
                          <UserRound size={16} className="text-blue-500" />
                          <span>{app.patient_name}</span>
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <span>
                            <Phone size={16} className="text-blue-500" />
                          </span>
                          <span>{app.patient_phone}</span>
                        </p>
                      </div>
                      <div
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center `}
                      >
                        <span
                          className={`${darkMode ? "text-green-500" : "text-green-600"} mr-3 text-lg `}
                        >
                          {" "}
                          {app.total_fees}&nbsp; L.E
                        </span>
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
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center">
                            <BriefcaseMedical
                              className={`mr-2 ${darkMode ? "text-red-300" : "text-red-300"}`}
                              size={16}
                            />
                            <span
                              className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                            >
                              <span className="font-medium">
                                Appointment Type:&nbsp; {app.appointment_type}
                              </span>{" "}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Wallet
                              className={`mr-2 ${darkMode ? "text-green-400" : "text-green-500"}`}
                              size={16}
                            />
                            <span
                              className={` ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                            >
                              <span className="font-medium">
                                Clinic Fee:&nbsp;
                                <span className="text-green-500">
                                  {app.fee}
                                  &nbsp; L.E
                                </span>
                              </span>{" "}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {app.services.map((s) => {
                              return (
                                <>
                                  {" "}
                                  <Wallet
                                    className={`mr-2 ${darkMode ? "text-green-400" : "text-green-500"}`}
                                    size={16}
                                  />
                                  <span className=" text-sm font-medium">
                                    {s.service_name} &nbsp;
                                  </span>
                                  <span className="text-green-500">
                                    {s.service_fee} L.E
                                  </span>
                                </>
                              );
                            })}
                          </div>
                          <div className="flex items-start"></div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentAppointment;
