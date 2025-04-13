import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";
import PatientVisitHistory from "../../components/patient/PatientVisitHistory";
import { getPatientInfoByIdApi, updatePatientApi } from "../../api/patient";
import { getAllAppointmentWrappersApi } from "../../api/appointmentWrapper";
import { patientInit } from "../../initData";
import { toastError, toastSuccess } from "../../utils/toastify";
import {
  User,
  Pencil,
  Save,
  X,
  Phone,
  Mail,
  Home,
  VenusAndMars,
  CalendarHeart,
  Building2,
  Blend,
  BriefcaseBusiness,
} from "lucide-react";
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
        <div>
          <div className="flex items-center justify-between mb-6 ">
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
                <h2 className="flex items-center text-sm font-semibold text-gray-500">
                  {isEdit ? (
                    <input
                      className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"}
                        w-[330px] text-sm p-1 rounded-md`}
                      type="text"
                      value={patient.name}
                      name="name"
                      onChange={(e) =>
                        setPatient({ ...patient, name: e.target.value })
                      }
                    />
                  ) : (
                    <span className="flex gap-4">
                      <span>{patient.name}</span>
                      <span
                        onClick={() => setIsEdit(!isEdit)}
                        className="cursor-pointer "
                      >
                        {!isEdit && (
                          <Pencil
                            className="text-gray-500 hover:text-green-500"
                            size={22}
                          />
                        )}
                      </span>
                    </span>
                  )}
                </h2>
              </div>
            </div>

            {isEdit && (
              <div className="flex gap-3 ">
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
            {!isAppointment && !isEdit && (
              <button
                className="bg-purple-500 text-white text-sm block p-2 ml-4   rounded-md hover:bg-purple-700"
                onClick={() => onSchedule()}
              >
                schedule appointment
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
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-1`}
                >
                  <VenusAndMars
                    className={`mr-2 ${darkMode ? "text-purple-500" : "text-purple-700"}`}
                    size={16}
                  />
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
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-1`}
                >
                  <CalendarHeart
                    className={`mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                    size={16}
                  />
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
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-1`}
                >
                  <Blend
                    className={`mr-2 ${darkMode ? "text-green-400" : "text-green-600"}`}
                    size={16}
                  />
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
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-1`}
                >
                  <Building2
                    className={`mr-2 ${darkMode ? "text-amber-900" : "text-amber-700"}`}
                    size={16}
                  />
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
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-1`}
                >
                  <BriefcaseBusiness
                    className={`mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                    size={16}
                  />
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
            <div className="flex flex-col gap-2">
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex  items-center gap-2`}
              >
                <VenusAndMars
                  className={`mr-2 ${darkMode ? "text-purple-500" : "text-purple-700"}`}
                  size={16}
                />
                Gender:&nbsp;{" "}
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-semibold text-sm`}
                >
                  {patient.gender}
                </span>
              </p>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex  items-center gap-2`}
              >
                <CalendarHeart
                  className={`mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                  size={16}
                />
                Age:&nbsp;{" "}
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-semibold text-sm`}
                >
                  {" "}
                  {patient.age}{" "}
                </span>
                years
              </p>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex  items-center gap-2`}
              >
                <Blend
                  className={`mr-2 ${darkMode ? "text-green-400" : "text-green-600"}`}
                  size={16}
                />
                Marital:&nbsp;
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-semibold text-sm`}
                >
                  {patient.marital_status}{" "}
                </span>
              </p>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex  items-center gap-2`}
              >
                <Building2
                  className={`mr-2 ${darkMode ? "text-amber-900" : "text-amber-700"}`}
                  size={16}
                />
                Born City:&nbsp;
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-semibold text-sm`}
                >
                  {patient.born_city}
                </span>
              </p>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex  items-center gap-2`}
              >
                <BriefcaseBusiness
                  className={`mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                  size={16}
                />
                Occupation:&nbsp;
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-semibold text-sm`}
                >
                  {patient.occupation}
                </span>
              </p>
            </div>
          )}
        </div>

        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"} w-full rounded-lg shadow-md p-2 mb-1 transition-colors duration-200`}
        >
          <h3
            className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-lg font-semibold mb-2 flex items-center `}
          >
            <Phone className="mr-2 text-blue-500" size={18} />
            Contact Information
          </h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <Phone
                className={`mr-3 ${darkMode ? "text-blue-300" : "text-blue-700"}`}
                size={16}
              />
              {isEdit ? (
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.phone}
                  name="phone"
                  onChange={(e) =>
                    setPatient({
                      ...patient,

                      phone: e.target.value,
                    })
                  }
                />
              ) : (
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {patient.phone}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <Mail
                className={`mr-3 ${darkMode ? "text-blue-300" : "text-blue-700"}`}
                size={16}
              />
              {isEdit ? (
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.email}
                  name="email"
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      email: e.target.value,
                    })
                  }
                />
              ) : (
                <p
                  className={` ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {patient.email}
                </p>
              )}
            </div>
            <div className="flex items-start">
              <Home
                className={`mr-3 mt-1 ${darkMode ? "text-blue-300" : "text-blue-700"}`}
                size={16}
              />

              {isEdit ? (
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                  type="text"
                  value={patient.residence}
                  name="residence"
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      residence: e.target.value,
                    })
                  }
                />
              ) : (
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {patient.residence}
                </p>
              )}
            </div>
          </div>
        </div>

        <PatientVisitHistory
          appointmentWarappers={appointmentWrappers}
          isEdit={isEdit}
        />
      </div>
    </PatientColLayout>
  );
}

export default PatientInfo;
