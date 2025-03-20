import { useAppSettings } from "../../contextApi/appContext";
import { ArrowBigLeftDash, Printer } from "lucide-react";
type TProps = {
  setStage: (stage: string) => void;
  prescriptionOpen: (isOpen: boolean) => void;
  saveHandler: () => void;
};
function More({ setStage, prescriptionOpen, saveHandler }: TProps) {
  const { darkMode } = useAppSettings();
  return (
    <div>
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} h-[70vh]  rounded-lg shadow-xl p-1 w-full  flex flex-col justify-between`}
      >
        <h2>More</h2>
      </div>
      <div className="mt-4 flex justify-between ">
        <button
          className=" py-4  px-2 "
          onClick={() => setStage("prescription")}
        >
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
        <button className=" py-4 px-2" onClick={() => prescriptionOpen(true)}>
          <Printer
            className="text-yellow-500 hover:text-yellow-400"
            size={40}
          />
        </button>
      </div>
    </div>
  );
}

export default More;
