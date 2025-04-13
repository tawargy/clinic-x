import { useEffect, useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { TFeeAndServices, TFollowup, TService } from "../../../types";
import { toastError, toastSuccess } from "../../../utils/toastify";
import { followupNames } from "../../../utils/followupNames";
import {
  addFeeAndServicesApi,
  getFeeAndServicesApi,
  updateFeeAndServicesApi,
} from "../../../api/feeAndServices";

function FeesAndServices() {
  const [feeAndServices, setFeeAndServices] = useState<TFeeAndServices>({
    id: "",
    fee: "",
    followups: [{ followup_name: "followup_1", followup_fee: "" }],
    services: [],
  });
  const [services, setServices] = useState<TService[]>([]);
  const [followups, setFollowups] = useState<TFollowup[]>([
    { followup_name: "followup_1", followup_fee: "" },
  ]);

  const addFeeAndServices = async (data: TFeeAndServices) => {
    try {
      const res = await addFeeAndServicesApi(data);
      console.log("Added with ID:", res);
      toastSuccess("Fee and services added successfully");
    } catch (error) {
      console.error("Error adding fee and services:", error);
      toastError("Error adding fee and services");
    }
  };

  const updateFeeAndServices = async (data: TFeeAndServices) => {
    try {
      const res = await updateFeeAndServicesApi(data);
      console.log("Updated successfully", res);
      toastSuccess("Fee and services updated successfully");
      getFeeAndServices();
    } catch (error) {
      console.error("Error updating fee and services:", error);
      toastError("Error updating fee and services");
    }
  };

  const getFeeAndServices = async () => {
    try {
      const res = await getFeeAndServicesApi();
      if (res) {
        setFeeAndServices(res);
        setFollowups(
          res.followups || [{ followup_name: "followup_1", followup_fee: "" }],
        );
        setServices(res.services || []);

        console.log("Fee and services:", res);
      }
      return;
    } catch (error) {
      console.error("Error getting fee and services:", error);
      setFeeAndServices({
        id: "",
        fee: "",
        followups: [{ followup_name: "followup_1", followup_fee: "" }],
        services: [],
      });
      setFollowups([{ followup_name: "followup_1", followup_fee: "" }]);
      setServices([]);
    }
  };
  useEffect(() => {
    getFeeAndServices();
  }, []);
  const submetHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFeeAndServices = {
      ...feeAndServices,

      followups: followups,
      services: services,
    };

    if (feeAndServices.id) {
      updateFeeAndServices(updatedFeeAndServices);
    } else {
      addFeeAndServices(updatedFeeAndServices);
    }
  };

  const { darkMode } = useAppSettings();

  return (
    <div className="flex justify-around mt-8">
      <form
        className="w-full  flex flex-col justify-between gap-16 min-h-[700px] "
        onSubmit={submetHandler}
      >
        <div className="grid grid-cols-3 gap-16">
          <div className="col-span-1">
            <label htmlFor="vees" className="block w-full mt-4">
              Fee
              <input
                type="number"
                id="fee"
                value={feeAndServices.fee}
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                onChange={(e) => {
                  setFeeAndServices({
                    ...feeAndServices,
                    fee: e.target.value,
                  });
                }}
              />
            </label>

            <div className="mt-4">
              {followups.map((f, index) => (
                <div className="flex gap-4" key={index}>
                  <label
                    htmlFor={f.followup_name}
                    className="block w-full mt-2"
                    key={index}
                  >
                    {followupNames(f.followup_name)}
                    <input
                      className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                      type="number"
                      id={f.followup_name}
                      name={f.followup_name}
                      value={f.followup_fee}
                      onChange={(e) => {
                        const updatedFollowups = [...followups];
                        updatedFollowups[index] = {
                          ...f,
                          followup_fee: e.target.value,
                        };
                        setFollowups(updatedFollowups);
                      }}
                    />
                  </label>

                  {index === followups.length - 1 && followups.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={(e) => {
                        e.preventDefault();

                        setFollowups(followups.filter((_, i) => i !== index));
                      }}
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const followupLength = followups.length;
                  const followupName = `followup_${followupLength + 1}`;
                  setFollowups([
                    ...followups,
                    { followup_name: followupName, followup_fee: "" },
                  ]);
                }}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Followup
              </button>
            </div>
          </div>
          <div className="col-span-2 ">
            <div className="">
              <label htmlFor="services" className="block">
                Services
              </label>
              <div className=" max-h-[470px] overflow-y-scroll px-8">
                {services.map((service, index) => (
                  <div className="flex gap-2" key={index}>
                    <input
                      type="text"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mb-2 pl-4 p-2.5 transition-colors duration-200`}
                      value={service.service_name}
                      placeholder="Service name"
                      onChange={(e) => {
                        const updatedServices = [...services];
                        updatedServices[index] = {
                          ...service,
                          service_name: e.target.value,
                        };
                        setServices(updatedServices);
                      }}
                    />
                    <input
                      type="number"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mb-2 pl-4 p-2.5 transition-colors duration-200`}
                      value={service.service_fee}
                      placeholder="fee"
                      onChange={(e) => {
                        const updatedServices = [...services];
                        updatedServices[index] = {
                          ...service,
                          service_fee: e.target.value,
                        };
                        setServices(updatedServices);
                      }}
                    />
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        setServices(services.filter((_, i) => i !== index));
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setServices([
                    ...services,
                    { service_name: "", service_fee: "" }, // Initialize with empty name and 0 vees
                  ]);
                }}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Service
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-evenly">
          <button
            className="mt-8 py-4 px-8 bg-green-500 rounded-lg w-1/3 m-auto"
            type="submit"
          >
            Save
          </button>

          <button
            className="mt-8 py-4 px-8 bg-red-500 rounded-lg w-1/3 m-auto"
            type="submit"
          >
            Cansel
          </button>
        </div>
      </form>
    </div>
  );
}

export default FeesAndServices;
