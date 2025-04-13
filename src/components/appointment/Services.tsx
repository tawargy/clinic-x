import { useEffect, useState } from "react";
import { useClinic } from "../../contextApi/clinicContext";
import { useAppSettings } from "../../contextApi/appContext";
import PrescriptionsPrint from "../comman/PrescriptionsPrint";
import ReactSelect from "react-select";
import { getFeeAndServicesApi } from "../../api/feeAndServices";
import { formatDate } from "../../utils/date";
import { TFeeAndServices } from "../../types";
import { ArrowBigLeftDash, Printer, X } from "lucide-react";
import { useAppointment } from "../../contextApi/appointmentContext";
import { totalFees } from "../../utils/totalFees";

type TProps = {
  setStage: (stage: string) => void;
  saveHandler: () => void;
};

function Services({ setStage, saveHandler }: TProps) {
  const { darkMode } = useAppSettings();
  const { appointmentFees, setFee, addService, removeService, updateService } =
    useAppointment();
  const { appointmentType } = useClinic();
  const [feeAndServicesDb, setfeeAndServicesDb] = useState<TFeeAndServices>();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPrecisionOpen, setIsPrecisionOpen] = useState(false);

  const getFeeAndServices = async () => {
    try {
      const res = await getFeeAndServicesApi();
      if (res) {
        if (appointmentType === "new") {
          setFee(res.fee);
        } else {
          const followup = res.followups.find((f) => {
            return f.followup_name === appointmentType;
          });
          followup && setFee(followup?.followup_fee);
        }
        setfeeAndServicesDb(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeeAndServices();
  }, []);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const service = feeAndServicesDb?.services.find(
      (s) => s.service_name === selectedOption?.value,
    );
    if (service) {
      addService(service);
      setSelectedOption(null);
    }
  };

  const onDeleteHandler = (index: number) => {
    removeService(index);
  };
  // Convert services to React-Select options format
  const serviceOptions = feeAndServicesDb?.services.map((service) => ({
    value: service.service_name,
    label: service.service_name,
  }));

  // Custom styles for React-Select
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#374151" : "white",
      borderColor: darkMode ? "#4B5563" : "#D1D5DB",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: darkMode
        ? state.isSelected
          ? "#4B5563"
          : state.isFocused
            ? "#374151"
            : "#1F2937"
        : state.isSelected
          ? "#2563EB"
          : state.isFocused
            ? "#F3F4F6"
            : "white",

      color: darkMode ? "white" : "black",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: darkMode ? "white" : "black",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#1F2937" : "white",
    }),
  };

  return (
    <div className="h-[calc(100vh-210px)] flex flex-col justify-between ">
      {isPrecisionOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50  z-50 ">
          <PrescriptionsPrint
            setIsOpen={setIsPrecisionOpen}
            printDate={new Date()}
            visitDate={formatDate(new Date())}
          />
        </div>
      ) : (
        ""
      )}
      <div>
        <div className="h-[550px] max-h-[550px] overflow-y-auto custom-scrollbar rounded-lg shadow-md  px-4">
          <h2 className="py-2">Services</h2>
          <div
            className={`${darkMode ? "border-gray-700" : " border-gray-100"} border  rounded-md`}
          >
            <p className="px-2 py-4 pr-8 flex gap-2 items-center justify-between">
              <span>Clinic Fee: </span>
              <input
                type="number"
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                        border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[20%]  pl-4 p-2.5 transition-colors duration-200`}
                value={appointmentFees.fee}
                onChange={(e) => setFee(e.target.value)}
              />{" "}
            </p>
          </div>
          <div>
            {appointmentFees.services.map((service, index) => (
              <div key={index} className="flex items-center gap-2 mt-4">
                <div className="w-[100%]">
                  <p className="flex gap-2 pr-8 items-center justify-between relative">
                    <button
                      className="absolute right-1 top-3"
                      onClick={() => onDeleteHandler(index)}
                    >
                      <X size={18} className="text-red-500" />
                    </button>
                    <span>{service.service_name}</span>
                    <input
                      className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                                         border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[20%]  pl-4 p-2.5 transition-colors duration-200`}
                      value={service.service_fee}
                      onChange={(e) =>
                        updateService(index, {
                          ...service,
                          service_fee: e.target.value,
                        })
                      }
                    />{" "}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row-reverse">
            <div className="flex flex-col    gap-2 mt-16">
              <h4>Total: </h4>
              <p className="text-2xl font-bold">
                {/* {appointmentFees.services.reduce((acc, service) => {
                  // Check if service_fee is a valid number
                  const serviceFee = !isNaN(parseFloat(service.service_fee))
                    ? parseFloat(service.service_fee)
                    : 0;
                  return acc + serviceFee;
                }, 0) +
                  // Check if fee is a valid number
                  (!isNaN(parseFloat(appointmentFees.fee))
                    ? parseFloat(appointmentFees.fee)
                    : 0)} */}
                {totalFees(appointmentFees)}
              </p>
            </div>
          </div>
        </div>
        <form className=" w-full   " onSubmit={onSubmitHandler}>
          <div className=" flex  items-center gap-4 ">
            <div className="w-[80%] ">
              <ReactSelect
                options={serviceOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                styles={customStyles}
                className="mt-1"
                classNamePrefix="select"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-400    py-2 px-4 rounded-md  text-white hover:bg-blue-500"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-4 flex justify-between ">
        <button className=" py-4  px-2 " onClick={() => setStage("requests")}>
          <ArrowBigLeftDash
            className="text-gray-500 hover:text-gray-400"
            size={40}
          />
        </button>
        <button
          className="w-1/4 m-auto  bg-green-500 text-white py-4  px-2 rounded-md hover:bg-green-700"
          onClick={() => saveHandler()}
        >
          Save & Close
        </button>
        <button className=" py-4 px-2" onClick={() => setIsPrecisionOpen(true)}>
          <Printer
            className="text-yellow-500 hover:text-yellow-400"
            size={40}
          />
        </button>
      </div>
    </div>
  );
}

export default Services;
