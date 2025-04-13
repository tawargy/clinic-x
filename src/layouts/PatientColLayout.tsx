import { useAppSettings } from "../contextApi/appContext";
type TProps = {
  children: React.ReactNode;
};

function PatientColLayout({ children }: TProps) {
  const { darkMode } = useAppSettings();
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-wight"}  rounded-lg shadow-md  pb-2  transition-colors duration-200
          h-[calc(100vh-130px)] w-full   flex flex-col justify-between max-h[calc(100vh-130px)] overflow-y-auto custom-scrollbar`}
    >
      {children}
    </div>
  );
}

export default PatientColLayout;
