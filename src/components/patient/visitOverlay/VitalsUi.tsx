import { useAppSettings } from "../../../contextApi/appContext";
import { TAppointment } from "../../../types";

import {
  Stethoscope,
  Heart,
  Thermometer,
  Activity,
  Leaf,
  Wind,
  Droplet,
  Ruler,
  Weight,
} from "lucide-react";

type TProps = {
  appointment: TAppointment;
};

function getVitalIcon(vitalName: string) {
  const iconSize = 18;
  const iconClass = "mr-2 text-gray-500 dark:text-gray-400";

  const normalizedName = vitalName.toLowerCase();

  if (normalizedName.includes("pulse")) {
    return <Activity size={iconSize} className={iconClass} />;
  }
  if (normalizedName.includes("temp")) {
    return <Thermometer size={iconSize} className={iconClass} />;
  }
  if (normalizedName.includes("bp")) {
    return <Heart size={iconSize} className={iconClass} />;
  }
  if (normalizedName.includes("spo2")) {
    return <Leaf size={iconSize} className={iconClass} />;
  }
  if (normalizedName.includes("rr")) {
    return <Wind size={iconSize} className={iconClass} />;
  }
  if (normalizedName.includes("rbs")) {
    return <Droplet size={iconSize} className={iconClass} />;
  }
  if (normalizedName.includes("height")) {
    return <Ruler size={iconSize} className={iconClass} />;
  }

  if (normalizedName.includes("weight")) {
    return <Weight size={iconSize} className={iconClass} />;
  }

  // Default icon if no match
  return <Activity size={iconSize} className={iconClass} />;
}

function VitalsUi({ appointment }: TProps) {
  const { darkMode } = useAppSettings();

  return (
    <div
      className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg shadow-sm p-4 mb-6`}
    >
      <h3
        className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}
      >
        <Stethoscope size={16} className="inline mr-2" />
        Vitals
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {appointment.vitals.map((vital, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-3 rounded-md ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-750"
                : "bg-white hover:bg-gray-50"
            } shadow-sm transition-colors duration-150 border ${darkMode ? "border-gray-700" : "border-gray-100"}`}
          >
            {getVitalIcon(vital.v_name)}
            <div>
              <p
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {vital.v_name.toUpperCase()}
              </p>
              <p
                className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                {vital.v_value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VitalsUi;
