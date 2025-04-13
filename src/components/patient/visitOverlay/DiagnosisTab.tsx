import { useEffect } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import InfoCard from "./InfoCard";
import { AlertCircle, Activity, FileText, Stethoscope } from "lucide-react";
import { TAppointment } from "../../../types";
import { useDiagnosis } from "../../../hooks/useDiagnosis";

type TProps = {
  appointment: TAppointment;
};

function DetailsTab({ appointment }: TProps) {
  const { darkMode } = useAppSettings();
  const { diagnosis, setDiagnosisId } = useDiagnosis();

  useEffect(() => {
    setDiagnosisId(appointment.provisional_diagnosis);
  }, [appointment.provisional_diagnosis]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar pr-2 h-full">
      <div className="space-y-6  max-h-[380px] overflow-y-auto custom-scrollbar">
        <InfoCard
          title="Complaint"
          content={appointment.complaint}
          icon={<AlertCircle size={18} />}
          darkMode={darkMode}
        />
        <InfoCard
          title="Present Health Problems"
          content={appointment.present_history}
          icon={<Activity size={18} />}
          darkMode={darkMode}
        />
        <InfoCard
          title="Examination"
          content={appointment.examination}
          icon={<Stethoscope size={18} />}
          darkMode={darkMode}
        />
      </div>

      <div>
        <div
          className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4 mb-6`}
        >
          <h3
            className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}
          >
            <FileText size={18} className="mr-2" />
            Diagnosis
          </h3>
          <div className="space-y-3  max-h-[380px] overflow-y-auto custom-scrollbar">
            {diagnosis &&
              diagnosis.diagnosis.map((d, i) => {
                if (!d.diagnosis_title) return null;
                return (
                  <div
                    key={i}
                    className={`border ${
                      darkMode
                        ? "border-gray-600 bg-gray-800"
                        : "border-gray-200 bg-gray-50"
                    } p-3 rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col gap-1`}
                  >
                    <p
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-800"} flex gap-4 items-center `}
                    >
                      <span
                        className={`${d.diagnosis_type === "acute" ? "text-blue-400" : "text-yellow-500"} text-sm `}
                      >
                        {" "}
                        {d.diagnosis_type}
                      </span>
                      <span
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} flex gap-2 mt-1`}
                      >
                        <span>[{d.start}</span>
                        <span>:</span>
                        <span>{d.end}]</span>
                      </span>
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-300 " : "text-gray-600"} flex gap-4`}
                    >
                      {" "}
                      {d.diagnosis_title}
                    </p>
                    <p></p>
                    {d.comment && (
                      <p
                        className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
                      >
                        {d.comment}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsTab;
