import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import Form from "../components/comman/form/Form";
import { TPatientInfo } from "../validations/patientInfoSchema";
import { toastSuccess, toastError } from "../utils/toastify";
import { useClinic } from "../contextApi/clinicContext";
import { useAppSettings } from "../contextApi/appContext";
import {
  X,
  ArrowLeft,
  User,
  Heart,
  Activity,
  Clipboard,
  Pill,
  FileText,
  History,
  Phone,
  Mail,
  Home,
  Shield,
  Calendar,
} from "lucide-react";

const patient = {
  id: "342432",
  name: "xxxx",
  age: "56",
  gender: "male",
  bloodType: "O+",
  height: "182",
  weight: "79",
  bloodPressure: `120/90 mmHg`,
  heartRate: `60 bpm`,
  temperature: `37 °F`,
  allergies: "allergies",
  medications: ["medications", "fdsf"],
  conditions: ["conditions"],
  notes: "fdsf fdsf fdsfds",
  history: [
    {
      date: "20/4/2000",
      reason: "any",
      diagnosis: "any",
      treatment: "any",
      doctor: "any",
    },
    {
      date: "20/4/2000",
      reason: "any",
      diagnosis: "any",
      treatment: "any",
      doctor: "any",
    },
    {
      date: "20/4/2000",
      reason: "any",
      diagnosis: "any",
      treatment: "any",
      doctor: "any",
    },
    {
      date: "20/4/2000",
      reason: "any",
      diagnosis: "any",
      treatment: "any",
      doctor: "any",
    },
    {
      date: "20/4/2000",
      reason: "any",
      diagnosis: "any",
      treatment: "any",
      doctor: "any",
    },
  ],
  contactInfo: {
    phone: "01117834885",
    email: "test@test.com",
    address: "cairo ",
  },
  insurance: {
    provider: "xyz",
    policyNumber: "43243252524",
    groupNumber: "5235425435",
  },
  status: "waiting",
};

function PatentBasicInfo() {
  const { patientInfo, setPatientInfo } = useClinic();
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useAppSettings();
  const { id } = useParams();

  const getPatientInfo = async () => {
    try {
      const res = await invoke<TPatientInfo>("get_patient_info", {
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
  const onEdite = async (data: TPatientInfo) => {
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
  const onAddToAgenda = async () => {
    navigate("/agenda");
  };
  const onCancel = () => {
    setIsEdit(false);
    navigate(`/patient-basic-info/${id}`);
  };

  return (
    <div className="container mx-auto p-4 relative">
      <div
        className=" w-7 h-7 flex items-center justify-center bg-white  rounded-md absolute right-0 top-0  cursor-pointer"
        onClick={() => navigate("/")}
      >
        <X
          className="w-full h-full rounded-md bg-red-500 text-white font-bold"
          size={20}
        />
      </div>
      <div
        className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} w-full  rounded-lg shadow-md p-4 transition-colors duration-200  flex flex-col`}
      >
        {isEdit ? (
          <Form
            onSubmitHandler={onEdite}
            btnText="Save"
            patientInfo={patientInfo}
            onCancel={onCancel}
          />
        ) : (
          <>
            {/* Main content */}
            <main className="container mx-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Patient info */}
                <div className="lg:col-span-1">
                  <div
                    className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-1 mb-2 transition-colors duration-200`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div
                          className={`${darkMode ? "bg-blue-900" : "bg-blue-100"} p-3 rounded-full mr-4`}
                        >
                          <User
                            className={`${darkMode ? "text-blue-300" : "text-blue-600"}`}
                            size={24}
                          />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{patient.name}</h2>
                          <p
                            className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {patient.age} years • {patient.gender} •{" "}
                            {patient.bloodType}
                          </p>
                        </div>
                      </div>
                      <button
                        className="bg-green-500 text-white  p-2 rounded-md hover:bg-green-700"
                        onClick={onAddToAgenda}
                      >
                        Add Appointment
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div
                        className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}
                      >
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1`}
                        >
                          Height
                        </p>
                        <p className="font-medium">{patient.height}</p>
                      </div>
                      <div
                        className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}
                      >
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1`}
                        >
                          Weight
                        </p>
                        <p className="font-medium">{"patient.weight"}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Heart
                          className={`mr-3 ${darkMode ? "text-red-400" : "text-red-500"}`}
                          size={20}
                        />
                        <div>
                          <p
                            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            Blood Pressure
                          </p>
                          <p className="font-medium">{patient.bloodPressure}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Activity
                          className={`mr-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                          size={20}
                        />
                        <div>
                          <p
                            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            Heart Rate
                          </p>
                          <p className="font-medium">{patient.heartRate}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clipboard
                          className={`mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
                          size={20}
                        />
                        <div>
                          <p
                            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            Temperature
                          </p>
                          <p className="font-medium">{patient.temperature}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 mb-6 transition-colors duration-200`}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Phone className="mr-2" size={18} />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone
                          className={`mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          size={16}
                        />
                        <p>{patient.contactInfo.phone}</p>
                      </div>
                      <div className="flex items-center">
                        <Mail
                          className={`mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          size={16}
                        />
                        <p>{patient.contactInfo.email}</p>
                      </div>
                      <div className="flex items-start">
                        <Home
                          className={`mr-3 mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          size={16}
                        />
                        <p>{patient.contactInfo.address}</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 transition-colors duration-200`}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Shield className="mr-2" size={18} />
                      Insurance
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          Provider
                        </p>
                        <p className="font-medium">
                          {patient.insurance.provider}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          Policy Number
                        </p>
                        <p className="font-medium">
                          {patient.insurance.policyNumber}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          Group Number
                        </p>
                        <p className="font-medium">
                          {patient.insurance.groupNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column - Medical info */}
                <div className="lg:col-span-2 flex">
                  <div
                    className={`${darkMode ? "bg-gray-800" : "bg-white"} w-1/2 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200`}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Pill className="mr-2" size={18} />
                      Medical Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4
                          className={`text-md font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Allergies
                        </h4>
                        <p
                          className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {patient.allergies || "None reported"}
                        </p>
                      </div>
                      <div>
                        <h4
                          className={`text-md font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Medications
                        </h4>
                        {patient.medications.length > 0 ? (
                          <ul
                            className={`list-disc pl-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {patient.medications.map((med, index) => (
                              <li key={index}>{med}</li>
                            ))}
                          </ul>
                        ) : (
                          <p
                            className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            None
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4
                        className={`text-md font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Conditions
                      </h4>
                      {patient.conditions.length > 0 ? (
                        <ul
                          className={`list-disc pl-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {patient.conditions.map((condition, index) => (
                            <li key={index}>{condition}</li>
                          ))}
                        </ul>
                      ) : (
                        <p
                          className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          No conditions reported
                        </p>
                      )}
                    </div>

                    <div>
                      <h4
                        className={`text-md font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Notes
                      </h4>
                      <p
                        className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {patient.notes}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`${darkMode ? "bg-gray-800" : "bg-white"} w-1/2 rounded-lg shadow-md p-6 transition-colors duration-200`}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <History className="mr-2" size={18} />
                      Visit History
                    </h3>

                    {patient.history.length > 0 ? (
                      <div className="space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar pr-2">
                        {patient.history.map((visit, index) => (
                          <div
                            key={index}
                            className={`${darkMode ? "border-gray-700" : "border-gray-200"} border-l-4 pl-4 ${
                              index !== patient.history.length - 1 ? "pb-6" : ""
                            }`}
                          >
                            <div className="flex items-center mb-2">
                              <Calendar
                                className={`mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                size={16}
                              />
                              <p
                                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}
                              >
                                {new Date(visit.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p
                                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  Reason for Visit
                                </p>
                                <p
                                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  {visit.reason}
                                </p>
                              </div>
                              <div>
                                <p
                                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  Diagnosis
                                </p>
                                <p
                                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  {visit.diagnosis}
                                </p>
                              </div>
                              <div>
                                <p
                                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  Treatment
                                </p>
                                <p
                                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  {visit.treatment}
                                </p>
                              </div>
                              <div>
                                <p
                                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  Doctor
                                </p>
                                <p
                                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  {visit.doctor}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p
                        className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        No visit history available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </main>

            {/* <div className="flex flex-col text-sm lg:text-lg lg:gap-4 lg:p-4 ">
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
              </div> */}
          </>
        )}
      </div>
    </div>
  );
}
export default PatentBasicInfo;
