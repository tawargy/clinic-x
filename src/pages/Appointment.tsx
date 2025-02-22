import AppointmentForm from "../components/appointment/AppointmentForm";
import BasicPatientInfo from "../components/appointment/BasicPatientInfo";
import Prescriptions from "../components/appointment/Prescriptions";

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
  return (
    <div className="flex justify-between gap-2 p-4 bg-gray-100 mt-4 w-[95%] m-auto rounded-md">
      <div className="w-[48%] bg-white rounded-md flex flex-col gap-8">
        <BasicPatientInfo patientInfo={patientInfo} />
        <AppointmentForm />
      </div>
      <Prescriptions />
    </div>
  );
}

export default Appointment;
