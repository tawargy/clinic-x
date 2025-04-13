import { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print"; // First install this package: npm install react-to-print
import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";
import { getClinicInfoApi } from "../../api/clinicInfo";
import { formatDate } from "../../utils/date";
import { clinicInfoInit } from "../../initData";
import { TClinicInfo } from "../../types";
import { X, PrinterCheck } from "lucide-react";
import Rx from "../../assets/rx.png";

type Tprops = {
  setIsOpen: (isOpen: boolean) => void;
  visitDate: string;
  printDate: Date;
};

function PrescriptionsPrint({ setIsOpen, visitDate, printDate }: Tprops) {
  const { prescriptions, patientInfo } = useClinic();
  const { darkMode } = useAppSettings();
  const [clinicInfo, setClinicInfo] = useState<TClinicInfo>(clinicInfoInit);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  console.log(visitDate);

  const getClinicInfo = async () => {
    try {
      const res = await getClinicInfoApi();
      res && setClinicInfo(res);
    } catch (e) {
      console.error("Error getting appointment days:", e);
    }
  };
  useEffect(() => {
    getClinicInfo();
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  z-50 ">
      <div className="flex  justify-center gap-4 min-h-screen p-4 ">
        <div className="flex w-[40%] gap-4 max-w-7xl relative">
          <div
            className=" w-7 h-7 flex items-center justify-center bg-white  rounded-md absolute right-0 top-0  cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <X
              className="w-full h-full rounded-md bg-red-500 text-white font-bold"
              size={20}
            />
          </div>

          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"} max-h-[100vh] overflow-y-auto custom-scrollbar rounded-lg shadow-xl p-6 w-full`}
          >
            <div
              ref={contentRef}
              className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-xl p-6 w-full`}
            >
              <div className="print-content flex flex-col justify-between min-h-[800px] max-h-[800px] overflow-y-auto custom-scrollbar border-2 border-gray-300 rounded-lg p-4  custom-scrollbar">
                <div>
                  <div className="flex justify-between gap-4">
                    <div className="">
                      {/* <p>Code: {patientInfo?.id}</p> */}
                      <p>Name: {patientInfo?.name}</p>
                      <p>Age: {patientInfo?.age}</p>
                      <p>Dx: </p>
                      <p>Visit Date: {visitDate}</p>
                      <p>Next: تمت الاستشارة</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-3xl text-blue-700">
                        {clinicInfo.clinic_name}
                      </h2>
                      <h3>{clinicInfo.speciality}</h3>
                      {clinicInfo.memberships &&
                        clinicInfo.memberships.map((membership, index) => (
                          <p key={index}>{membership}</p>
                        ))}
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-gray-300 my-4"></div>
                  {prescriptions.map((prescription, index) => (
                    <div key={index} className="mb-8">
                      <h3 className="flex gap-2 mb-2">
                        <img src={Rx} alt="Rx" className="w-[20px] h-[20px]" />
                        <span>{prescription.name}</span>
                      </h3>
                      <div className="flex gap-4">
                        <p>Dosage: {prescription.dosage}</p>
                        <p>Duration: {prescription.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className=" ">
                  <p>printted on {formatDate(printDate)}</p>
                  <div className="flex flex-col text-right  border-[1px] border-gray-300 rounded-lg p-2 mt-1">
                    <p>{clinicInfo.address}</p>
                    <p className="flex  flex-row-reverse gap-4">
                      <span>من</span>{" "}
                      <span>{clinicInfo.appointments.from} </span>
                      <span>الى </span>
                      <span> {clinicInfo.appointments.to}</span>
                      <span> ماعدا - </span>
                      <span>({clinicInfo.appointments.excepting}) </span>
                    </p>
                    <p className="flex flex-row-reverse gap-4">
                      {clinicInfo.contactus &&
                        clinicInfo.contactus.map((c) => (
                          <span key={c}>{c}</span>
                        ))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row-reverse">
                <button
                  className=" mt-6 py-3 px-8 "
                  onClick={() => reactToPrintFn()}
                >
                  <PrinterCheck className="text-yellow-500" size={40} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionsPrint;
