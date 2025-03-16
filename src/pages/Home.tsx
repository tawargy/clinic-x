import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../contextApi/appContext";
import { Search, Clock, Users, UserPlus } from "lucide-react";
import PatientQueue from "../components/PatientQueue";
import SearchPatient from "../components/SearchPatient";
import RecentPatients from "../components/RecentPatients";
import { TPatientInfo } from "../types";
import { useClinic } from "../contextApi/clinicContext";
import { patientInit } from "../initData";
import { formatDate } from "../utils/date";

type TPatient = {
  id: string;
  name: string;
};

function Home() {
  const { darkMode } = useAppSettings();
  const [queue, setQueue] = useState([]);
  const [recently, setRecently] = useState<TPatientInfo[] | undefined>([]);
  const [searchResults, setSearchResults] = useState<TPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { setPatientInfo } = useClinic();
  const currentDate = new Date();

  useEffect(() => {
    getRecently();
    setPatientInfo(patientInit);
    getAppointmentDays(formatDate(currentDate));
  }, []);

  async function getRecently() {
    const recently = (await invoke("get_recently")) as
      | TPatientInfo[]
      | undefined;
    setRecently(recently);
  }

  const getAppointmentDays = async (date) => {
    try {
      const res = await invoke("get_appointment_days", {
        date,
      });
      console.log(res);
      if (res) {
        setQueue(res.patient_data);
      } else {
        setQueue([]);
      }
    } catch (e) {
      console.error("Error getting appointment days:", e);
    }
  };

  const getPatient = async (input: string) => {
    console.log(input);
    try {
      const res = (await invoke("search_patients", {
        searchTerm: input,
      })) as TPatient[];
      setSearchResults(res);
      console.log("Search ressults", res);
    } catch (e) {
      console.log("Search error", e);
      setSearchResults([]);
    }
  };

  const handleSearch = (term: string) => {
    console.log(term);
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }
    getPatient(searchTerm);
    // const results = allPatients.filter((patient) =>
    //   patient.name.toLowerCase().includes(term.toLowerCase()),
    // );
    // setSearchResults(results);
  };

  const navigate = useNavigate();
  const newPaientHandler = () => {
    navigate("/add-patient");
  };
  return (
    <div className="container mx-auto p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } rounded-lg shadow-md p-4 transition-colors duration-200 h-[calc(100vh-120px)] flex flex-col`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xl font-semibold flex items-center`}
              >
                <Users className="mr-2 text-blue-500" size={20} />
                Patient Queue
              </h2>
              <span
                className={`${
                  darkMode
                    ? "bg-blue-900 text-blue-100"
                    : "bg-blue-100 text-blue-800"
                } font-medium px-2.5 py-0.5 rounded-full transition-colors duration-200`}
              >
                {queue.length}
              </span>
            </div>

            <span
              className={`${
                darkMode ? " text-gray-400" : " text-gray-500"
              } text-md pl-8`}
            >
              {formatDate(currentDate)}
            </span>
          </div>
          <div className="flex-grow overflow-hidden">
            <PatientQueue patients={queue} />
          </div>
        </div>
        {/* Middle Column - Search */}
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } rounded-lg shadow-md p-4 transition-colors duration-200 h-[calc(100vh-120px)] flex flex-col`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xl font-semibold flex items-center`}
            >
              <Search className="mr-2 text-purple-500" size={20} />
              Search Patients
            </h2>
            <button
              onClick={newPaientHandler}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center text-sm transition-colors duration-200"
            >
              <UserPlus className="mr-1" size={16} />
              New Patient
            </button>
          </div>
          <div className="flex-grow overflow-hidden">
            <SearchPatient
              searchTerm={searchTerm}
              onSearch={handleSearch}
              searchResults={searchResults}
              darkMode={darkMode}
            />
          </div>
        </div>

        {/* Right Column - Recent Patients */}
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } rounded-lg shadow-md p-4 transition-colors duration-200 h-[calc(100vh-120px)] flex flex-col`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xl font-semibold flex items-center`}
            >
              <Clock className="mr-2 text-green-500" size={20} />
              Recent Patients
            </h2>
          </div>
          <div className="flex-grow overflow-hidden">
            <RecentPatients patients={recently ?? []} darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
