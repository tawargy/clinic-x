import { useAppSettings } from "../../contextApi/appContext";
import {
  Heart,
  Activity,
  Clipboard,
  Weight,
  Ruler,
  ThermometerSun,
  Leaf,
} from "lucide-react";

function getVitalIcon(vitalName: string) {
  const { darkMode } = useAppSettings();

  const iconMap: { [key: string]: JSX.Element } = {
    Height: (
      <Ruler
        className={`mr-3 ${darkMode ? "text-purple-400" : "text-purple-500"}`}
        size={20}
      />
    ),
    Weight: (
      <Weight
        className={`mr-3 ${darkMode ? "text-purple-400" : "text-purple-500"}`}
        size={20}
      />
    ),
    BP: (
      <Heart
        className={`mr-3 ${darkMode ? "text-red-400" : "text-red-500"}`}
        size={20}
      />
    ),
    Pulse: (
      <Activity
        className={`mr-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
        size={20}
      />
    ),
    Temperature: (
      <ThermometerSun
        className={`mr-3 ${darkMode ? "text-orange-400" : "text-orange-500"}`}
        size={20}
      />
    ),
    RR: (
      <Clipboard
        className={`mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
        size={20}
      />
    ),
    RBS: (
      <Clipboard
        className={`mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
        size={20}
      />
    ),
    SPO2: (
      <Leaf
        className={`mr-3 ${darkMode ? "text-green-400" : "text-green-500"}`}
        size={20}
      />
    ),
  };

  return iconMap[vitalName] || <Clipboard className="mr-3" size={20} />;
}

export default getVitalIcon;
