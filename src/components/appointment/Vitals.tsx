import { useAppSettings } from "../../contextApi/appContext";
import { useAppointment } from "../../contextApi/appointmentContext";

import {
  Heart,
  Activity,
  Clipboard,
  Weight,
  Ruler,
  ThermometerSun,
  Leaf,
  Droplet,
  Wind,
} from "lucide-react";

function Vitals() {
  const { appointment, setVitals } = useAppointment();
  const { darkMode } = useAppSettings();

  const getVitalValue = (name: string): string => {
    const vital = appointment.vitals.find((v) => v.v_name === name);
    return vital?.v_value || "";
  };
  // Helper function to handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    vitalName: string,
  ) => {
    const name = vitalName;
    const value = e.target.value;

    const newVitals = [...appointment.vitals];
    const vitalIndex = newVitals.findIndex((v) => v.v_name === name);

    if (vitalIndex !== -1) {
      // Update existing vital
      newVitals[vitalIndex] = { ...newVitals[vitalIndex], v_value: value };
    } else {
      // Add new vital
      newVitals.push({ v_name: name, v_value: value });
    }

    setVitals(newVitals);
  };

  const vitalsConfig = [
    { name: "height", icon: Ruler, label: "Height", color: "purple" },
    { name: "weight", icon: Weight, label: "Weight", color: "purple" },
    {
      name: "bp",
      icon: Heart,
      label: "BP",
      color: "red",
      title: "blood pressure",
    },
    {
      name: "pulse",
      icon: Activity,
      label: "P",
      color: "blue",
      title: "pulse",
    },
    {
      name: "temp",
      icon: ThermometerSun,
      label: "T",
      color: "orange",
      title: "temperature",
    },
    {
      name: "rr",
      icon: Wind,
      label: "RR",
      color: "blue",
      title: "respiratory rate",
    },
    {
      name: "rbs",
      icon: Droplet,
      label: "RBS",
      color: "red",
      title: "random blood sugar",
    },
    {
      name: "spo2",
      icon: Leaf,
      label: "SPO2",
      color: "green",
      title: "saturation pressure of oxygen",
    },
  ];

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-1 mb-2 transition-colors duration-200`}
    >
      <div className="grid grid-cols-4">
        {vitalsConfig.map((vital) => {
          const Icon = vital.icon;
          return (
            <div key={vital.name} className="flex items-center">
              <Icon
                className={`mr-3 ${darkMode ? `text-${vital.color}-400` : `text-${vital.color}-500`}`}
                size={38}
              />
              <div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  title={vital.title}
                >
                  {vital.label}
                </p>
                <input
                  className={`${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-200 border-gray-300 text-gray-900"
                  } w-[80%] text-sm p-1 rounded-md`}
                  type="text"
                  value={getVitalValue(vital.name)}
                  onChange={(e) => handleInputChange(e, vital.name)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Vitals;
