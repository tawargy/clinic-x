import { useAppSettings } from "../contextApi/appContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

type TProps = {
  children: React.ReactNode;
};
function PatientLayout({ children }: TProps) {
  const { darkMode } = useAppSettings();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto  relative  ">
      <div
        className=" w-7 h-7 flex items-center justify-center bg-white  rounded-md absolute right-0 top-0  cursor-pointer"
        onClick={() => navigate("/")}
      >
        <X
          className="w-full h-full rounded-md bg-red-500 text-white font-bold"
          size={20}
        />
      </div>
      <div
        className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} min-h-[85vh] w-full   rounded-lg shadow-md py-2 transition-colors duration-200  flex flex-col`}
      >
        {/* Main content */}
        <main className="container mx-auto px-2  ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PatientLayout;
