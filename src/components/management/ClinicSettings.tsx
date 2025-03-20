import { useState, useEffect } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";
import { TClinicManagment } from "../../types";
import { clinicManagmentInit, dummyClinicManagmentInit } from "../../initData";

function ClinicSettings() {
  const { darkMode } = useAppSettings();
  const { clinicManagment, setClinicManagment } = useClinic();
  const [clinicInfo, setClinicInfo] =
    useState<TClinicManagment>(clinicManagmentInit);
  const [memberships, setMemberships] = useState<string[]>(
    clinicManagment.memberships || [],
  );
  const [contactus, setContactus] = useState<string[]>([]);

  useEffect(() => {
    setClinicInfo(clinicManagment);
    setMemberships(clinicManagment.memberships || []);
    setContactus(clinicManagment.contactus || []);
  }, [clinicManagment]);

  const onChangeHandler = (e: any) => {
    const { name, value } = e.target;
    setClinicInfo((prevClinicInfo) => ({
      ...prevClinicInfo,
      [name]: value,
    }));
  };
  const onSaveHandler = (e) => {
    e.preventDefault();
    const updatedData = { ...clinicInfo, memberships, contactus };
    setClinicManagment(updatedData);
  };
  const onCancelHandler = () => {
    setClinicInfo(clinicManagment);
    setMemberships(clinicManagment.memberships || []);
    setContactus(clinicManagment.contactus || []);
  };
  return (
    <div className="flex flex-col gap-4 w-full ">
      <h3>Clinic Settings</h3>
      <form className="w-full flex flex-col  gap-24 " onSubmit={onSaveHandler}>
        <div className="grid grid-cols-3 gap-8 ">
          <div className=" flex flex-col gap-4 ">
            <div className="mb-2">
              <label htmlFor="clinicName">Clinic Name</label>
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                type="text"
                name="clinic_name"
                id="clinicName"
                value={clinicInfo.clinic_name}
                onChange={onChangeHandler}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="speciality">Speciality</label>
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                type="text"
                name="speciality"
                id="speciality"
                value={clinicInfo.speciality}
                onChange={onChangeHandler}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="memberships">Memberships</label>
              {memberships.map((membership, index) => (
                <input
                  key={index}
                  type="text"
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                    border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mb-2 pl-4 p-2.5 transition-colors duration-200`}
                  value={membership}
                  id="memberships"
                  onChange={(e) => {
                    const updatedAllMemberships = [...memberships];
                    updatedAllMemberships[index] = e.target.value;
                    setMemberships(updatedAllMemberships);
                  }}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  setMemberships([...memberships, ""]);
                  console.log(memberships);
                }}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Membership
              </button>
            </div>
          </div>
          <div className=" flex flex-col gap-4 ">
            <div className="mb-2">
              <label htmlFor="address">Address</label>
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                type="text"
                name="address"
                id="address"
                value={clinicInfo.address}
                onChange={onChangeHandler}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="contactus">contactus</label>
              {contactus.map((c, index) => (
                <input
                  key={index}
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                    mb-2 border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  type="text"
                  id="contactus"
                  value={c}
                  onChange={(e) => {
                    const updatedAllContactus = [...contactus];
                    updatedAllContactus[index] = e.target.value;
                    setContactus(updatedAllContactus);
                  }}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  setContactus([...contactus, ""]);
                }}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Contact
              </button>
            </div>
          </div>

          <div className=" ">
            <h4>Appointments</h4>
            <div className="flex  gap-2">
              <label htmlFor="from" className="text-sm w-full">
                From:
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  type="text"
                  name="from"
                  id="from"
                  value={clinicInfo.appointments.from}
                  onChange={onChangeHandler}
                />
              </label>

              <label htmlFor="to" className="text-sm w-full">
                To:
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  type="text"
                  name="to"
                  id="to"
                  value={clinicInfo.appointments.to}
                  onChange={onChangeHandler}
                />
              </label>
              <label htmlFor="to" className="text-sm w-full">
                Excepting:
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                              border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  type="text"
                  name="excepting"
                  id="excepting"
                  value={clinicInfo.appointments.excepting}
                  onChange={onChangeHandler}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="flex ">
          <button
            type="submit"
            className="block w-1/4 m-auto mt-4 bg-green-500 py-6 px-16 rounded-lg text-white text-center hover:bg-green-700"
          >
            Save
          </button>
          <button
            type="button"
            className="block w-1/4 m-auto mt-4 bg-red-500 py-6 px-16 rounded-lg text-white text-center hover:bg-red-700"
            onClick={onCancelHandler}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClinicSettings;
