import { useRef } from "react";
import { useReactToPrint } from "react-to-print"; // First install this package: npm install react-to-print
import { useAppSettings } from "../contextApi/appContext";
import Rx from "../assets/rx.png";

type TMedicine = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
};
type Tprops = {
  prescriptions: TMedicine[];
};

function PrescriptionsPrint({ prescriptions }: Tprops) {
  const { darkMode } = useAppSettings();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} max-h-[100vh] overflow-y-auto custom-scrollbar rounded-lg shadow-xl p-6 w-full`}
    >
      <div
        ref={contentRef}
        className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-xl p-6 w-full`}
      >
        <div className="print-content flex flex-col justify-between min-h-[743px] border-2 border-gray-300 rounded-lg p-4  custom-scrollbar">
          <div>
            <div className="flex justify-between gap-4">
              <div className="">
                <p>Code: 45678</p>
                <p>Name: محمد على</p>
                <p>Age: 25</p>
                <p>Dx: </p>
                <p>Date: 2022-03-01</p>
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

        <button
          className="bg-blue-400 block w-1/3 m-auto mt-6 py-3 px-8 rounded-md text-white hover:bg-blue-500 print:hidden"
          onClick={() => reactToPrintFn()}
        >
          Print
        </button>
      </div>
    </div>
  );
}

export default PrescriptionsPrint;
