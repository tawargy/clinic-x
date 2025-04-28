import { useEffect, useState } from "react";
import { useAppSettings } from "../contextApi/appContext";
import { useClinic } from "../contextApi/clinicContext";
import { useAppointment } from "../contextApi/appointmentContext";
import PatientQueue from "../components/home/PatientQueue";
import SearchPatient from "../components/home/SearchPatient";
import RecentPatients from "../components/home/RecentPatients";
import { searchPatientApi } from "../api/patient";
import { getAppointmentDaysApi } from "../api/appointmentDay";
import { getRecentlyApi } from "../api/queueAndRecently";
import { formatDate } from "../utils/date";
import { TPatientInfo, TPatientInfoQ } from "../types";
import { patientInit, patientInfoQInit, prescriptionsInit } from "../initData";
import RecentAppointment from "../components/home/RecentAppointment";
import { Clock, BriefcaseMedical } from "lucide-react";

type TPatient = {
  id: string;
  name: string;
};

function Home() {
  const { setPatientInfo, setIsAppointment, setMedicine, setPrescriptions } =
    useClinic();
  const { darkMode } = useAppSettings();
  const { resetAll } = useAppointment();
  const [queue, setQueue] = useState<TPatientInfoQ[]>([patientInfoQInit]);
  const [recently, setRecently] = useState<TPatientInfo[]>([patientInit]);
  const [searchResults, setSearchResults] = useState<TPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState("recentPatient");
  const currentDate = new Date();

  const initAppSettings = async () => {
    try {
      const recently = await getRecentlyApi();
      if (recently) setRecently(recently);
      const patientsQueue = await getAppointmentDaysApi(
        formatDate(currentDate),
      );
      if (patientsQueue) setQueue(patientsQueue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    initAppSettings();
    resetAll();
    setPatientInfo(patientInit);
    setIsAppointment(false);
    setPrescriptions([]);
    setMedicine(prescriptionsInit);
  }, []);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const res = await searchPatientApi(term);
      if (res) {
        setSearchResults(res);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PatientQueue patients={queue} currentDate={currentDate} />

        <SearchPatient
          searchTerm={searchTerm}
          onSearch={handleSearch}
          searchResults={searchResults}
          darkMode={darkMode}
        />
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } rounded-lg shadow-md p-4 transition-colors duration-200 h-[calc(100vh-130px)] flex flex-col`}
        >
          <ul className="flex  justify-evenly mb-10">
            <li
              className={`${show === "recentPatient" ? "text-yellow-600 hover:text-yellow-500 shadow-xl" : "text-gray-500 hover:text-gray-400"}
                text-sm font-medium flex items-center lg:p-4 rounded-lg`}
            >
              <button
                onClick={() => setShow("recentPatient")}
                className="flex items-center lg:gap-2"
              >
                <Clock size={18} />
                <span> Recent Patients</span>
              </button>
            </li>
            <li
              className={`${show === "recentAppointment" ? "text-yellow-600 hover:text-yellow-500 shadow-xl" : "text-gray-500 hover:text-gray-400"}
                text-sm font-medium flex items-center lg:p-4 rounded-lg`}
            >
              <button
                onClick={() => setShow("recentAppointment")}
                className="flex items-center lg:gap-2"
              >
                <BriefcaseMedical size={18} />
                <span> Recent Appointment</span>
              </button>
            </li>
          </ul>
          {show === "recentPatient" && (
            <RecentPatients patients={recently ?? []} />
          )}
          {show === "recentAppointment" && (
            <RecentAppointment patients={recently ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
