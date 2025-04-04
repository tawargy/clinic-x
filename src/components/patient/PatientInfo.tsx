import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";
import ContactAndInsurance from "./ContactAndInsurance";
import PatientVisitHistory from "../../components/patient/PatientVisitHistory";
import { getPatientInfoByIdApi, updatePatientApi } from "../../api/patient";
import { getAllAppointmentWrappersApi } from "../../api/appointmentWrapper";
import { patientInit } from "../../initData";
import { toastError, toastSuccess } from "../../utils/toastify";
import { User, Pencil, Save, X, CircleArrowOutUpRight } from "lucide-react";
import { TPatientInfo, TAppointmentWrapper } from "../../types";
import PatientColLayout from "../../layouts/PatientColLayout";

type Tprops = {
  id: string | undefined;
  onSchedule: () => void;
};

function PatientInfo({ id }: Tprops) {
  const [originalPatient, setOriginalPatient] =
    useState<TPatientInfo>(patientInit);
  const [patient, setPatient] = useState<TPatientInfo>(patientInit);
  const [appointmentWrappers, setAppointmentWrappers] = useState<
    TAppointmentWrapper[]
  >([]);
  const [isEdit, setIsEdit] = useState(false);
  const { setPatientInfo, isAppointment } = useClinic();

  const navigate = useNavigate();
  const { darkMode } = useAppSettings();

  const getPatientInfo = async () => {
    if (!id) return;
    try {
      const res = await getPatientInfoByIdApi(id);
      if (res) {
        setOriginalPatient(res);
        setPatient(res);
        setPatientInfo(res);
      }
      return;
    } catch (e) {
      toastError("Failed to update patient");
      console.log(e);
    }
  };

  const getAppointmentWrappers = async (id: string) => {
    try {
      const wrappers = await getAllAppointmentWrappersApi(id);
      if (wrappers) setAppointmentWrappers(wrappers.reverse());
    } catch (error) {
      console.error("Error fetching last appointment wrapper:", error);
      return [];
    }
  };
  useEffect(() => {
    getPatientInfo();
    getAppointmentWrappers(id || "");
  }, []);

  const updatePatient = async () => {
    try {
      if (id) {
        const res = await updatePatientApi(id, patient);
        console.log(res);
        toastSuccess("Successfully updated patient");
      }
    } catch (e) {
      toastError("Failed to update patient");
      console.log(e);
    }
  };
  const onCancelUpdate = () => {
    setPatient(originalPatient);
  };

  const onSchedule = () => {
    navigate("/agenda");
  };

  return (
    <PatientColLayout>
      <div className="lg:col-span-1 ">
        <div
        // className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-1 mb-2 transition-colors duration-200`}
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
                <h2 className="flex items-center text-2xl font-bold text-gray-500">
                  {isEdit ? (
                    <input
                      className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                      type="text"
                      value={patient.name}
                      name="name"
                      onChange={(e) =>
                        setPatient({ ...patient, name: e.target.value })
                      }
                    />
                  ) : (
                    <>
                      {patient.name}
                      <span
                        onClick={() => setIsEdit(!isEdit)}
                        className="cursor-pointer ml-8"
                      >
                        {!isEdit && (
                          <Pencil
                            className="text-gray-500 hover:text-green-500"
                            size={22}
                          />
                        )}
                      </span>
                    </>
                  )}
                </h2>
              </div>
            </div>

            {isEdit && (
              <div className="flex gap-6">
                <span
                  onClick={() => {
                    updatePatient();
                    setIsEdit(!isEdit);
                  }}
                  className="cursor-pointer"
                >
                  <Save className="text-green-400" size={35} />
                </span>
                <span
                  onClick={() => {
                    setIsEdit(!isEdit);
                    onCancelUpdate();
                  }}
                  className="cursor-pointer"
                >
                  <X className="text-red-400" size={35} />
                </span>
              </div>
            )}
            {!isAppointment && (
              <button
                className="bg-purple-500 text-white text-sm lg:py-1 ml-4  lg:px-1 rounded-md hover:bg-purple-700"
                onClick={() => onSchedule()}
              >
                Schedule Visit
              </button>
            )}
          </div>
        </div>

        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-1 mb-2 transition-colors duration-200`}
        >
          {isEdit ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-8">
                <label
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Gender
                </label>{" "}
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[40%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.gender}
                  name="gender"
                  onChange={(e) =>
                    setPatient({ ...patient, gender: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between px-8">
                <label
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Age
                </label>{" "}
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[40%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.age}
                  name="age"
                  onChange={(e) =>
                    setPatient({ ...patient, age: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between px-8">
                <label
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Marital
                </label>{" "}
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[40%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.marital_status}
                  name="marital_status"
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      marital_status: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-between px-8">
                <label
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Born City
                </label>{" "}
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[40%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.born_city}
                  name="born_city"
                  onChange={(e) =>
                    setPatient({ ...patient, born_city: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between px-8">
                <label
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Occupation
                </label>{" "}
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[40%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.occupation}
                  name="occupation"
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      occupation: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex  items-center gap-2`}
              >
                <CircleArrowOutUpRight className="text-purple-500" size={14} />
                Gender:&nbsp;{" "}
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {patient.gender}
                </span>
              </p>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex  items-center gap-2`}
              >
                <CircleArrowOutUpRight className="text-purple-500" size={14} />
                Age:&nbsp;{" "}
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {" "}
                  {patient.age}{" "}
                </span>
                years
              </p>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex  items-center gap-2`}
              >
                <CircleArrowOutUpRight className="text-purple-500" size={14} />
                Marital:&nbsp;
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {patient.marital_status}{" "}
                </span>
              </p>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex  items-center gap-2`}
              >
                <CircleArrowOutUpRight className="text-purple-500" size={14} />
                Born City:&nbsp;
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {patient.born_city}
                </span>
              </p>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex  items-center gap-2`}
              >
                <CircleArrowOutUpRight className="text-purple-500" size={14} />
                Occupation:&nbsp;
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {patient.occupation}
                </span>
              </p>
            </>
          )}
        </div>
        <ContactAndInsurance
          patient={patient}
          onPatientUpdate={setPatient}
          isEdit={isEdit}
        />

        <PatientVisitHistory
          appointmentWarappers={appointmentWrappers}
          isEdit={isEdit}
        />
      </div>
    </PatientColLayout>
  );
}

export default PatientInfo;
