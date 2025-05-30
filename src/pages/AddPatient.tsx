import { useNavigate } from "react-router-dom";
import AddPatientForm from "../components/patient/AddPatientForm";
import { useAppSettings } from "../contextApi/appContext";
import { toastError, toastSuccess } from "../utils/toastify";
import { formatDate, getAge } from "../utils/date";
import { TPatientSchema } from "../validations/patientInfoSchema";
import { addPatientApi } from "../api/patient";
import { TPatientInfo } from "../types";
import { X } from "lucide-react";

function AddPatient() {
  const navigate = useNavigate();
  const { darkMode } = useAppSettings();

  const onSubmitHandler = async (data: TPatientSchema) => {
    try {
      const completedData: TPatientInfo = {
        ...data,
        id: "",
        dob: formatDate(data.dob),
        age: getAge(data.dob),
        insurance_group_number: "",
        insurance_policy_number: "",
        insurance_provider: "",
      };
      const res = await addPatientApi(completedData);
      toastSuccess("Successfully added patient");
      navigate(`/patient/${res}`);
    } catch (e) {
      toastError("Failed to add patient");
      console.log(e);
    }
  };
  return (
    <div className="container mx-auto p-4   relative">
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        } rounded-lg shadow-md p-4 transition-colors duration-200 `}
      >
        <div
          className=" w-7 h-7 flex items-center justify-center bg-white  rounded-md absolute right-0 top-0  cursor-pointer"
          onClick={() => navigate("/")}
        >
          <X
            className="w-full h-full rounded-md bg-red-500 text-white font-bold"
            size={20}
          />
        </div>
        <h1 className="text-center text-3xl text-blue-600  py-4 rounded-t-md">
          Add Patient
        </h1>
        <AddPatientForm
          onSubmitHandler={onSubmitHandler}
          btnText="Save"
          onCancel={() => navigate("/")}
        />
      </div>
    </div>
  );
}
export default AddPatient;
