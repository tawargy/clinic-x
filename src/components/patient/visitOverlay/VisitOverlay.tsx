import { useAppSettings } from "../../../contextApi/appContext";
import { useVisitOverlay } from "../../../hooks/useVisitOverlay";
import { X } from "lucide-react";
import VisitSelectorUi from "./VisitSelectorUi";
import VitalsUi from "./VitalsUi";
import DetailsTab from "./DetailsTab";

type TProps = {
  appointment_wrapper_id: string;
  onClose: () => void;
};

function VisitOverlay({ appointment_wrapper_id, onClose }: TProps) {
  const { darkMode } = useAppSettings();
  const { appointmentWrapper, appointment, appointmentId, setAppointmentId } =
    useVisitOverlay(appointment_wrapper_id);
  //const [isPrint, setIsPrint] = useState(false);
  return (
    <div className="flex justify-center items-center w-full h-screen  ">
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } w-full max-w-6xl h-[90vh] rounded-lg shadow-xl p-6 flex flex-col relative`}
      >
        <button
          className="absolute right-4 top-4 z-10  p-1   transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <X
            size={24}
            className="w-full h-full rounded-md bg-red-500 text-white font-bold hover:bg-red-700"
          />
        </button>

        <VisitSelectorUi
          appointmentWrapper={appointmentWrapper}
          appointmentId={appointmentId}
          setAppointmentId={setAppointmentId}
          appointment={appointment}
        />
        <VitalsUi appointment={appointment} />
        <DetailsTab appointment={appointment} />

        {/*
        {isPrint && <PrescriptionsPrint setIsOpen={setIsPrint} />} */}
      </div>
    </div>
  );
}

// Helper component for info cards
export default VisitOverlay;
