import { useRef } from "react";
import { useReactToPrint } from "react-to-print"; // First install this package: npm install react-to-print
import { useAppSettings } from "../../contextApi/appContext";
import Rx from "../../assets/rx.png";
import { useClinic } from "../../contextApi/clinicContext";
import { X, PrinterCheck } from "lucide-react";
import { formatDate } from "../../utils/date";
type Tprops = {
  setIsOpen: (isOpen: boolean) => void;
};

function PrescriptionsPrint({ setIsOpen }: Tprops) {
  const { prescriptions, patientInfo } = useClinic();
  const { darkMode } = useAppSettings();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <div className="flex  justify-center gap-4 min-h-screen p-4 ">
      <div className="flex w-[50%] gap-4 max-w-7xl relative">
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
                    <p>Date: {formatDate(new Date())}</p>
                    <p>Next: تمت الاستشارة</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl text-blue-700">عمرو عثمان</h2>
                    <p>المراسلة الاولى</p>
                    <p>المراسلة الثانية</p>
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
                      <p>Frequency: {prescription.frequency}</p>
                      <p>Duration: {prescription.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className=" flex flex-col text-right  border-[1px] border-gray-300 rounded-lg p-2 mt-4">
                <p>العنوان: عزبة البرج شارع الفنار</p>
                <p>المواعيد</p>
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
  );
}

export default PrescriptionsPrint;
