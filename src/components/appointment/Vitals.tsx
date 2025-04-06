import { useAppSettings } from "../../contextApi/appContext";
import { TAppointment, TVitals } from "../../types";

import {
  Heart,
  Activity,
  Clipboard,
  Weight,
  Ruler,
  ThermometerSun,
  Leaf,
} from "lucide-react";

type TProps = {
  appointment: TAppointment;
  // onChangeHandler: (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  // ) => void;

  onVitalsChangeHandler: (name: string, value: string) => void;
};
function Vitals({ appointment, onVitalsChangeHandler }: TProps) {
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
    onVitalsChangeHandler(vitalName, e.target.value);
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
      icon: Clipboard,
      label: "RR",
      color: "yellow",
      title: "respiratory rate",
    },
    {
      name: "rbs",
      icon: Clipboard,
      label: "RBS",
      color: "yellow",
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
  // return (
  //   <div
  //     className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-1 mb-2 transition-colors duration-200`}
  //   >
  //     <div className=" grid grid-cols-4 ">
  //       <div className="flex items-center">
  //         <Ruler
  //           className={`mr-3 ${darkMode ? "text-purple-400" : "text-purpl-500 "}`}
  //           size={38}
  //         />
  //         <div>
  //           <p
  //             className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
  //           >
  //             Hight
  //           </p>
  //           <input
  //             className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
  //             type="text"
  //             value={appointment.height}
  //             name="height"
  //             onChange={onChangeHandler}
  //           />
  //         </div>
  //       </div>
  //       <div className="flex items-center">
  //         <Weight
  //           className={`mr-3 ${darkMode ? "text-purple-400" : "text-purpl-500 "}`}
  //           size={38}
  //         />
  //         <div>
  //           <p
  //             className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
  //           >
  //             Weight
  //           </p>
  //           <input
  //             className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
  //             type="text"
  //             value={appointment.weight}
  //             name="weight"
  //             onChange={onChangeHandler}
  //           />
  //         </div>
  //       </div>
  //       <div className="flex items-center">
  //         <Heart
  //           className={`mr-3 ${darkMode ? "text-red-400" : "text-red-500"}`}
  //           size={38}
  //         />
  //         <div>
  //           <p
  //             className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
  //             title="blood pressure"
  //           >
  //             BP
  //           </p>
  //           <input
  //             className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
  //             type="text"
  //             value={appointment.bp}
  //             name="bp"
  //             onChange={onChangeHandler}
  //           />
  //         </div>
  //       </div>
  //       <div className="flex items-center">
  //         <Activity
  //           className={`mr-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
  //           size={38}
  //         />
  //         <div>
  //           <p
  //             className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
  //             title="pulse"
  //           >
  //             P
  //           </p>
  //           <input
  //             className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
  //             type="text"
  //             value={appointment.p}
  //             name="p"
  //             onChange={onChangeHandler}
  //           />
  //         </div>
  //       </div>
  //       <div className="flex items-center">
  //         <ThermometerSun
  //           className={`mr-3 ${darkMode ? "text-orange-400" : "text-orange-500"}`}
  //           size={38}
  //         />
  //         <div>
  //           <p
  //             className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
  //             title="temperature"
  //           >
  //             T
  //           </p>
  //           <input
  //             className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
  //             type="text"
  //             value={appointment.t}
  //             name="t"
  //             onChange={onChangeHandler}
  //           />
  //         </div>
  //       </div>

  //       <div className="flex items-center">
  //         <Clipboard
  //           className={`mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
  //           size={38}
  //         />
  //         <div>
  //           <p
  //             className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
  //             title="respiratory rate"
  //           >
  //             RR
  //           </p>
  //           <input
  //             className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
  //             type="text"
  //             value={appointment.rr}
  //             name="rr"
  //             onChange={onChangeHandler}
  //           />
  //         </div>
  //       </div>
  //       <div className="flex items-center">
  //         <Clipboard
  //           className={`mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
  //           size={38}
  //         />
  //         <div>
  //           <p
  //             className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
  //             title="random blood sugar"
  //           >
  //             RBS
  //           </p>
  //           <input
  //             className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
  //             type="text"
  //             value={appointment.rbs}
  //             name="rbs"
  //             onChange={onChangeHandler}
  //           />
  //         </div>
  //       </div>

  //       <div className="flex items-center">
  //         <Leaf
  //           className={`mr-3 ${darkMode ? "text-green-400" : "text-green-500"}`}
  //           size={38}
  //         />
  //         <div>
  //           <p
  //             className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
  //             title="saturation pressure of oxygen"
  //           >
  //             SPO2
  //           </p>
  //           <input
  //             className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
  //             type="text"
  //             value={appointment.spo2}
  //             name="spo2"
  //             onChange={onChangeHandler}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default Vitals;
