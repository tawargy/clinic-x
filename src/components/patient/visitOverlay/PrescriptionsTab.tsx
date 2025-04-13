import { useAppSettings } from "../../../contextApi/appContext";
import { useRequest } from "../../../hooks/useRequest";
import { TAppointment } from "../../../types";
type TProps = {
  appointment: TAppointment;
};
function PrescriptionsTab({ appointment }: TProps) {
  const { darkMode } = useAppSettings();
  const { requests } = useRequest(appointment.requests);
  return (
    <div className="grid grid-cols-2 gap-6  pr-2  overflow-y-autoto custom-scrollbar  ">
      <div
        className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4    overflow-y-auto custom-scrollbar`}
      >
        <h3
          className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}
        >
          Prescriptions
        </h3>
        <div className="">
          {appointment &&
            appointment.prescription.map((p, i) => {
              if (!p.name) return null;
              return (
                <div
                  key={i}
                  className={`border ${
                    darkMode
                      ? "border-gray-600 bg-gray-800"
                      : "border-gray-200 bg-gray-50"
                  } p-3 rounded-lg hover:shadow-md transition-shadow duration-200`}
                >
                  <p
                    className={`font-medium ${darkMode ? "text-gray-300 " : "text-gray-600"} flex gap-4`}
                  >
                    <span> {p.name}</span>
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
                  >
                    dosage: <span> {p.dosage}</span>
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
                  >
                    duration: <span> {p.duration}</span>
                  </p>
                </div>
              );
            })}
        </div>
      </div>
      <div
        className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4`}
      >
        <h3
          className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}
        >
          Requstes
        </h3>

        <div className="   max-h-[320px] overflow-y-auto custom-scrollbar">
          {requests &&
            requests.map((r, i) => {
              if (!r.req_name) return null;
              return (
                <div
                  key={i}
                  className={`border ${
                    darkMode
                      ? "border-gray-600 bg-gray-800"
                      : "border-gray-200 bg-gray-50"
                  } p-3 rounded-lg hover:shadow-md transition-shadow duration-200`}
                >
                  <p className="flex justify-between mb-2 text-sm">
                    <span
                      className={`${r.req_type === "imaging" ? "text-blue-500" : "text-yellow-500"}`}
                    >
                      {" "}
                      {r.req_type}
                    </span>
                    <span> {r.req_date}</span>
                  </p>
                  <p
                    className={`font-medium ${darkMode ? "text-gray-300 " : "text-gray-600"} flex gap-4`}
                  >
                    <span> {r.req_name}</span>
                  </p>

                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
                  >
                    {r.comment}
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
                  >
                    <span>Resualt :</span>
                    <span>{r.resualt}</span>
                  </p>
                </div>
              );
            })}
        </div>
        <div className="space-y-3"></div>
      </div>
    </div>
  );
}

export default PrescriptionsTab;
