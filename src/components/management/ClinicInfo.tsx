import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { invoke } from "@tauri-apps/api/core";
import { useAppSettings } from "../../contextApi/appContext";
import Select from "../comman/formFaild/Select";
import Input from "../comman/formFaild/Input";
import { TClinicInfo } from "../../types";
import { clinicInfoInit } from "../../initData";
import SelectExcepting from "./SelectExcepting";
import { toastError, toastSuccess } from "../../utils/toastify";

function ClinicInfo() {
  const { darkMode } = useAppSettings();
  const [clinicInfo, setClinicInfo] = useState<TClinicInfo>(clinicInfoInit);

  const [memberships, setMemberships] = useState<string[]>(
    clinicInfo.memberships || [],
  );
  const [contactus, setContactus] = useState<string[]>([]);
  const [excepting, setExcepting] = useState<string[]>([]);

  const getClinicInfo = async () => {
    try {
      const res = await invoke<TClinicInfo>("get_clinic_info", {});
      setClinicInfo(res);
    } catch (e) {
      console.error("Error getting appointment days:", e);
    }
  };
  const addClinicInfo = async (data: TClinicInfo) => {
    try {
      const res = await invoke<TClinicInfo>("add_clinic_info", { data });
      console.log(res);
      toastSuccess("The Clinic Info added successfuly");
    } catch (e) {
      console.error("Error added clinic info:", e);
      toastError("The Clinic Info not added!");
    }
  };

  const updateClinicInfo = async (data: TClinicInfo) => {
    try {
      const res = await invoke<TClinicInfo>("update_clinic_info", { data });
      console.log(res);

      toastSuccess("The Clinic Info updated successfuly");
    } catch (e) {
      console.error("Error clinic info updat:", e);

      toastError("The Clinic Info not updated!");
    }
  };
  useEffect(() => {
    getClinicInfo();
  }, []);
  const {
    register,
    handleSubmit,
    control,
    reset,

    formState: { errors },
  } = useForm<TClinicInfo>({
    mode: "onBlur",
    defaultValues: clinicInfoInit,
  });

  useEffect(() => {
    //setClinicInfo(dummyClinicInfoInit);
    reset(clinicInfo);
    setMemberships(clinicInfo.memberships || []);
    setContactus(clinicInfo.contactus || []);
    setExcepting(clinicInfo.appointments.excepting || []);
  }, [clinicInfo]);

  const onSaveHandler = (data: TClinicInfo) => {
    const updatedData = {
      ...data,
      contactus,
      memberships,

      appointments: {
        ...data.appointments,
        excepting: excepting, // Add the excepting array to appointments
      },
    };
    if (clinicInfo.id) {
      updateClinicInfo(updatedData);
    } else {
      addClinicInfo(updatedData);
    }
  };
  const onCancelHandler = () => {
    reset(clinicInfo);
    setMemberships(clinicInfo.memberships || []);
    setContactus(clinicInfo.contactus || []);
  };
  return (
    <div className="flex flex-col gap-4 w-full ">
      <h3>Clinic Settings</h3>
      <form
        className="w-full flex flex-col  gap-24 "
        onSubmit={handleSubmit(onSaveHandler)}
      >
        <div className="grid grid-cols-3 gap-8 ">
          <div className=" flex flex-col gap-4 ">
            <div className="mb-2">
              <Input
                label="Name"
                name="clinic_name"
                register={register}
                error={errors.clinic_name?.message}
              />
            </div>
            <div className="mb-2">
              <Input
                label="Speciality"
                name="speciality"
                register={register}
                error={errors.speciality?.message}
              />
            </div>
            <div className="mb-2 h-[300px] overflow-y-auto custom-scrollbar">
              <label htmlFor="memberships">Memberships</label>
              {memberships.map((membership, index) => (
                <div className="flex gap-2 " key={index}>
                  <input
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

                  <button
                    className="text-red-500"
                    onClick={() => {
                      const allMemberships = [...memberships];
                      const updatedAllMemberships = allMemberships.filter(
                        (i) => i !== allMemberships[index],
                      );
                      setMemberships(updatedAllMemberships);
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMemberships([...memberships, ""]);
                }}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Membership
              </button>
            </div>
          </div>
          <div className=" flex flex-col gap-4 ">
            <div className="mb-2">
              <Input
                label="Address"
                name="address"
                register={register}
                error={errors.address?.message}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="contactus">contactus</label>
              {contactus.map((c, index) => (
                <div className="flex gap-2" key={index}>
                  <input
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
                  <button
                    className="text-red-500"
                    onClick={() => {
                      const allContactus = [...contactus];
                      const updatedAllContactus = allContactus.filter(
                        (i) => i !== allContactus[index],
                      );
                      setContactus(updatedAllContactus);
                    }}
                  >
                    x
                  </button>
                </div>
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
            <div>
              <div className="flex  gap-2">
                <Select
                  label="From"
                  name="appointments.from"
                  control={control}
                  options={["5:00 PM", "6:00 PM", "7:00 PM"]}
                />
                <Select
                  label="To"
                  name="appointments.to"
                  control={control}
                  options={["10:00 PM", "11:00 PM", "12:00 PM"]}
                />
              </div>
              <div>
                <SelectExcepting
                  setExcepting={setExcepting}
                  excepting={excepting}
                />
              </div>
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

export default ClinicInfo;
