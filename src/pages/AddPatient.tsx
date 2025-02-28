import { useNavigate } from "react-router-dom";
import { FaWindowClose } from "react-icons/fa";
import { toastSuccess, toastError } from "../utils/toastify";
import Form from "../components/comman/form/Form";
import { invoke } from "@tauri-apps/api/core";
import { TFormValue } from "../validations/patientInfoSchema";

function AddPatient() {
  const navigate = useNavigate();
  const onSubmitHandler = async (data: TFormValue) => {
    console.log(data.dob);
    try {
      if (!data.dob) data.dob = "";
      if (data.dob instanceof Date)
        data.dob = new Date(data.dob)
          .toLocaleDateString("en-GB")
          .split("/")
          .join("-");
      {
        console.log(data.dob);
      }
      const formattedData = {
        ...data,
        id: "",
      };

      console.log(formattedData);
      const res = await invoke("add_patient", { data: formattedData });
      console.log(res);
      toastSuccess("Successfully added patient");
      navigate("/");
    } catch (e) {
      toastError("Failed to add patient");
      console.log(e);
    }
  };
  return (
    <div className="container mx-auto   bg-white rounded-lg shadow-lg dark:bg-bg-dark  dark:shadow-blue-500/50 pb-2 relative">
      <div className=" w-7 h-7 flex items-center justify-center bg-white p-[1px] rounded-md absolute right-3 top-3  cursor-pointer">
        <FaWindowClose
          onClick={() => navigate("/")}
          className="w-full h-full text-red-500"
        />
      </div>
      <h1 className="text-center text-xl text-white bg-blue-700 py-4 rounded-t-md">
        Add Patient
      </h1>
      <Form onSubmitHandler={onSubmitHandler} btnText="Save" />
    </div>
  );
}
export default AddPatient;
