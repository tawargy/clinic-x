import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWindowClose } from "react-icons/fa";
import AppointmentForm from "../components/appointment/AppointmentForm";
import BasicPatientInfo from "../components/appointment/BasicPatientInfo";
import Prescriptions from "../components/appointment/Prescriptions";
import { useAppSettings } from "../contextApi/context";

const patientInfo = {
  name: "Mohamed Ali",
  dob: "25-5-1980",
  gender: "Mail",
  occupation: "Developer",
  residence: "ezbit elborg",
  bornCity: "ezbit elborg",
  Tel: "0111568899",
  email: "test@test.com",
  married: "Yes",
  smoker: "yes",
  SI: "",
  specialhabits: "",
};

function Appointment() {
  const navigate = useNavigate();
  const { isAppointment, setIsAppointment } = useAppSettings();

  console.log(isAppointment);
  useEffect(() => {
    setIsAppointment(true);
    return () => {
      setIsAppointment(false);
    };
  }, []);
  return (
    <div className="flex justify-between h-[90vh] relative  gap-2 p-4 bg-gray-100  w-[98%] m-auto rounded-md shadow-lg dark:bg-bg-dark  dark:shadow-blue-500/50">
      <div className=" w-7 h-7 flex items-center justify-center bg-white p-[1px] rounded-md absolute right-0 top-0  cursor-pointer">
        <FaWindowClose
          onClick={() => navigate("/")}
          className="w-full h-full text-red-500"
        />
      </div>
      <div className="w-[50%] bg-white rounded-md flex flex-col gap-4 p-2">
        <BasicPatientInfo patientInfo={patientInfo} />
        <AppointmentForm />
      </div>
      <Prescriptions />
    </div>
  );
}

export default Appointment;
