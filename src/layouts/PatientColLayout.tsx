import { useAppSettings } from "../contextApi/appContext";
type TProps = {
  children: React.ReactNode;
};

function PatientColLayout({ children }: TProps) {
  const { darkMode } = useAppSettings();
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-wight"}  rounded-lg shadow-md p-1 pb-2  transition-colors duration-200
          h-[calc(100vh-130px)] w-full rounded-lg shadow-md   transition-colors duration-200flex flex-col justify-between`}
    >
      {children}
    </div>
  );
}

export default PatientColLayout;
