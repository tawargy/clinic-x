import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { FaWindowClose } from "react-icons/fa";
import Form from "../components/comman/form/Form";
import { TFormValue } from "../validations/patientInfoSchema";
import { toastSuccess, toastError } from "../utils/toastify";

function PatentBasicInfo() {
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const [patientInfo, setPatientInfo] = useState<TFormValue | undefined>(
    undefined,
  );
  const { id } = useParams();

  const getPatientInfo = async () => {
    try {
      const res = await invoke<TFormValue>("get_patient_info", {
        patientId: id,
      });
      const formattedRes = {
        ...res,
        dob: res.dob
          ? new Date(res.dob.split("-").reverse().join("-"))
          : new Date(),
        // dob: new Date(res.dob),
      };
      setPatientInfo(formattedRes);
    } catch (e) {
      toastError("Failed to update patient");
      console.log(e);
    }
  };
  useEffect(() => {
    getPatientInfo();
  }, []);
  const onEdite = async (data: TFormValue) => {
    if (!data.dob) data.dob = "";
    if (data.dob instanceof Date)
      data.dob = new Date(data.dob)
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");
    try {
      const res = await invoke("update_patient", {
        patientId: id,
        data,
      });
      toastSuccess("Successfully updated patient");
      navigate("/");
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex justify-between relative  h-[80vh]  gap-4  bg-gray-100  w-[97%] m-auto  rounded-lg shadow-lg dark:bg-bg-dark  dark:shadow-blue-500/50 ">
      <div className=" w-7 h-7 flex items-center justify-center bg-white p-[1px] rounded-md absolute right-1 top-1  cursor-pointer">
        <FaWindowClose
          onClick={() => navigate("/")}
          className="w-full h-full text-red-500"
        />
      </div>
      <div className="w-[50%] bg-white rounded-md ">
        <h2 className="bg-blue-700 text-center py-4 rounded-t-md text-white lg:text-lg">
          Patient Basic info
        </h2>
        {isEdit ? (
          <Form
            onSubmitHandler={onEdite}
            btnText="edit"
            patientInfo={patientInfo}
          />
        ) : (
          <>
            <div className="flex flex-col text-sm lg:text-lg lg:gap-4 lg:p-4 ">
              <p>Name: {patientInfo?.name}</p>
              <p>
                Date of Birth:{" "}
                {patientInfo?.dob instanceof Date
                  ? patientInfo.dob.toLocaleDateString()
                  : typeof patientInfo?.dob === "string"
                    ? new Date(patientInfo.dob).toLocaleDateString()
                    : ""}
              </p>
              <p>Gender: {patientInfo?.gender}</p>
              <p>Occupation: {patientInfo?.occupation}</p>
              <p>Residence: {patientInfo?.residence}</p>
              <p>Born City: {patientInfo?.born_city}</p>
              <p>Tel: {patientInfo?.tel}</p>
              <p>Email: {patientInfo?.email}</p>
              <p>Marital Status: {patientInfo?.marital}</p>
              <p>Smoker: {patientInfo?.smoker}</p>
              <p>SI: {patientInfo?.si}</p>
              <p>Special Habits: {patientInfo?.special_habits}</p>
            </div>
            <button
              className="bg-blue-700 text-white py-2 px-4 rounded-md "
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          </>
        )}
      </div>
      <div className="w-[50%] bg-white rounded-md flex flex-col gap-4">
        <h2 className="bg-blue-700 text-center py-4 rounded-t-md text-white lg:text-lg">
          Timeline
        </h2>
      </div>
    </div>
  );
}
export default PatentBasicInfo;
