import { useEffect, useState } from "react";
import { useAppSettings } from "../contextApi/appContext";
import { useClinic } from "../contextApi/clinicContext";
import PatientQueue from "../components/home/PatientQueue";
import SearchPatient from "../components/home/SearchPatient";
import RecentPatients from "../components/home/RecentPatients";
import { searchPatientApi } from "../api/patient";
import { getAppointmentDaysApi } from "../api/appointmentDay";
import { getRecentlyApi } from "../api/queueAndRecently";
import { formatDate } from "../utils/date";
import { TPatientInfo, TPatientInfoQ } from "../types";
import { patientInit, patientInfoQInit, prescriptionsInit } from "../initData";
//import useClinicInit from "../hooks/useClinicInit";

type TPatient = {
  id: string;
  name: string;
};

function Home() {
  const { darkMode } = useAppSettings();
  const [queue, setQueue] = useState<TPatientInfoQ[]>([patientInfoQInit]);
  const [recently, setRecently] = useState<TPatientInfo[]>([patientInit]);
  const [searchResults, setSearchResults] = useState<TPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const currentDate = new Date();
  //const { setClinicInit } = useClinicInit();
  const { setPatientInfo, setIsAppointment, setMedicine, setPrescriptions } =
    useClinic();

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
    setPatientInfo(patientInit);
    setIsAppointment(false);
    setPrescriptions([]);
    setMedicine(prescriptionsInit);
  }, []);

  const handleSearch = async (term: string) => {
    console.log(term);
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const res = await searchPatientApi(searchTerm);
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
        <RecentPatients patients={recently ?? []} darkMode={darkMode} />
      </div>
    </div>
  );
}

export default Home;
