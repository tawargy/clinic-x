"use client";

import { useState } from "react";
import VisitSelectorUi from "./VisitSelectorUi";
import { useVisitOverlay } from "../../../hooks/useVisitOverlay";
import {
  X,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Gauge,
  Scale,
  Clock,
  TreesIcon as Lungs,
} from "lucide-react";

// Dummy data
const dummyAppointment = {
  id: "app-123",
  created_at: "2023-09-15T10:30:00Z",
  complaint:
    "Persistent headache and mild fever for the past 3 days. Patient reports difficulty sleeping and loss of appetite.",
  present_history:
    "Patient has a history of migraines. Last episode was 6 months ago. Currently taking acetaminophen with minimal relief. No recent travel or exposure to illness.",
  examination:
    "Temperature: 99.5°F. Patient appears fatigued. Mild tenderness in the frontal and temporal regions. No neck stiffness. Neurological examination normal. No photophobia observed.",
  provisional_diagnosis: "diag-456",
  prescription: [
    {
      name: "Sumatriptan",
      dosage: "50mg tablet, take one at onset of headache",
      duration: "As needed, not to exceed 2 tablets in 24 hours",
    },
    {
      name: "Promethazine",
      dosage: "25mg tablet, take one before bedtime",
      duration: "5 days",
    },
    {
      name: "Ibuprofen",
      dosage: "400mg tablet, take one every 6 hours",
      duration: "3 days",
    },
  ],
  vitals: [
    { v_name: "Blood Pressure", v_value: "128/82 mmHg" },
    { v_name: "Heart Rate", v_value: "78 bpm" },
    { v_name: "Temperature", v_value: "99.5°F" },
    { v_name: "Respiratory Rate", v_value: "16/min" },
    { v_name: "Oxygen Saturation", v_value: "98%" },
    { v_name: "Weight", v_value: "68 kg" },
    { v_name: "BMI", v_value: "24.2" },
    { v_name: "Blood Glucose", v_value: "110 mg/dL" },
  ],
};

const dummyDiagnosis = {
  diagnosis: [
    {
      diagnosis_type: "Primary:",
      diagnosis_title: "Migraine without aura",
      start: "2023-09-15",
      end: "Present",
      comment:
        "Recurring episodes with similar presentation. Consider preventive therapy if frequency increases.",
    },
    {
      diagnosis_type: "Secondary:",
      diagnosis_title: "Dehydration (mild)",
      start: "2023-09-15",
      end: "Present",
      comment:
        "Likely contributing to headache symptoms. Advised increased fluid intake.",
    },
  ],
};

const dummyAppointmentWrapper = {
  appointment_status: "Active",
  patient_name: "Jane Doe",
  patient_id: "PT-78945",
  doctor: "Dr. Smith",
};

const dummyFollowupIds = ["follow-1", "follow-2"];

function getVitalIcon(vitalName: string) {
  const iconSize = 18;
  const iconClass = "mr-2 text-gray-500 dark:text-gray-400";

  const normalizedName = vitalName.toLowerCase();

  if (normalizedName.includes("heart") || normalizedName.includes("pulse")) {
    return <Heart size={iconSize} className={iconClass} />;
  }
  if (
    normalizedName.includes("temp") ||
    normalizedName.includes("temperature")
  ) {
    return <Thermometer size={iconSize} className={iconClass} />;
  }
  if (
    normalizedName.includes("bp") ||
    normalizedName.includes("blood pressure")
  ) {
    return <Activity size={iconSize} className={iconClass} />;
  }
  if (normalizedName.includes("oxygen") || normalizedName.includes("spo2")) {
    return <Lungs size={iconSize} className={iconClass} />;
  }
  if (normalizedName.includes("glucose") || normalizedName.includes("sugar")) {
    return <Droplets size={iconSize} className={iconClass} />;
  }
  if (normalizedName.includes("weight")) {
    return <Scale size={iconSize} className={iconClass} />;
  }
  if (normalizedName.includes("bmi")) {
    return <Gauge size={iconSize} className={iconClass} />;
  }
  if (
    normalizedName.includes("rate") ||
    normalizedName.includes("respiratory")
  ) {
    return <Clock size={iconSize} className={iconClass} />;
  }

  // Default icon if no match
  return <Activity size={iconSize} className={iconClass} />;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
type TProps = {
  appointment_id: string;
  appointment_wrapper_id: string;

  onClose: () => void;
};
export default function VisitOverlay({
  appointment_id,
  appointment_wrapper_id,

  onClose,
}: TProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [pId, setPId] = useState(dummyAppointment.id);
  const [activeTab, setActiveTab] = useState("details");

  const { appointment, appointmentWrapper, diagnosis } = useVisitOverlay({
    appointment_id,
    appointment_wrapper_id,
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const followupNames = [
    "First follow up",
    "Second follow up",
    "Third follow up",
    "Fourth follow up",
  ];

  return (
    // <div className="flex w-full m-auto min-h-screen items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
    <div className="flex justify-center items-center w-full h-screen  ">
      {/* <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div> */}

      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"}
        bg-bg-light dark:bg-bg-dark
        w-full m-auto max-w-6xl h-[90vh] rounded-lg shadow-xl p-2 flex flex-col relative`}
      >
        <button
          className="absolute right-4 top-4 z-10 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} className="text-red-500" />
        </button>

        <VisitSelectorUi
          appointment={appointment}
          appointmentWrapper={appointmentWrapper}
        />
        {/* {renderVitals()}

        <div className="flex-1 overflow-hidden">
          {activeTab === "details"
            ? renderDetailsTab()
            : renderPrescriptionsTab()}
        </div>

        {isPrint && <PrescriptionsPrint setIsOpen={setIsPrint} />} */}
      </div>
    </div>
  );
}

// Helper component for info cards
function InfoCard({ title, content, icon, darkMode }) {
  if (!content) return null;

  return (
    <div
      className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200`}
    >
      <h3
        className={`text-sm font-medium mb-3 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
      >
        {icon}
        {title}
      </h3>
      <p
        className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
      >
        {content || `No ${title.toLowerCase()} information available`}
      </p>
    </div>
  );
}

// const renderVitals = () => {
//   return (
//     <div
//       className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg shadow-sm p-4 mb-6`}
//     >
//       <h3
//         className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}
//       >
//         <Stethoscope size={16} className="inline mr-2" />
//         Vitals
//       </h3>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//         {dummyAppointment.vitals.map((vital, index) => (
//           <div
//             key={index}
//             className={`flex items-center gap-2 p-3 rounded-md ${
//               darkMode
//                 ? "bg-gray-800 hover:bg-gray-750"
//                 : "bg-white hover:bg-gray-50"
//             } shadow-sm transition-colors duration-150 border ${darkMode ? "border-gray-700" : "border-gray-100"}`}
//           >
//             {getVitalIcon(vital.v_name)}
//             <div>
//               <p
//                 className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//               >
//                 {vital.v_name}
//               </p>
//               <p
//                 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
//               >
//                 {vital.v_value}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const renderDetailsTab = () => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar pr-2 h-full">
//       <div className="space-y-6">
//         <InfoCard
//           title="Complaint"
//           content={dummyAppointment.complaint}
//           icon={<AlertCircle size={18} />}
//           darkMode={darkMode}
//         />

//         <InfoCard
//           title="Present Health Problems"
//           content={dummyAppointment.present_history}
//           icon={<Activity size={18} />}
//           darkMode={darkMode}
//         />

//         <InfoCard
//           title="Examination"
//           content={dummyAppointment.examination}
//           icon={<Stethoscope size={18} />}
//           darkMode={darkMode}
//         />
//       </div>

//       <div>
//         <div
//           className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4 mb-6`}
//         >
//           <h3
//             className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}
//           >
//             <FileText size={18} className="mr-2" />
//             Diagnosis
//           </h3>
//           <div className="space-y-3">
//             {dummyDiagnosis.diagnosis.map((d, i) => (
//               <div
//                 key={i}
//                 className={`border ${
//                   darkMode
//                     ? "border-gray-600 bg-gray-800"
//                     : "border-gray-200 bg-gray-50"
//                 } p-3 rounded-lg hover:shadow-md transition-shadow duration-200`}
//               >
//                 <p
//                   className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
//                 >
//                   {d.diagnosis_type} {d.diagnosis_title}
//                 </p>
//                 <p
//                   className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} flex gap-2 mt-1`}
//                 >
//                   <span>[{d.start}</span>
//                   <span>:</span>
//                   <span>{d.end}]</span>
//                 </p>
//                 {d.comment && (
//                   <p
//                     className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
//                   >
//                     {d.comment}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4`}
//         >
//           <div className="flex justify-between items-center mb-3">
//             <h3
//               className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}
//             >
//               <ClipboardList size={18} className="mr-2" />
//               Lab Results
//             </h3>
//             <button
//               className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-gray-600 text-gray-300 hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} transition-colors`}
//             >
//               View All
//             </button>
//           </div>
//           <div
//             className={`p-4 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-gray-50"} text-center`}
//           >
//             <p
//               className={`text-sm italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//             >
//               No lab results available for this visit
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const renderPrescriptionsTab = () => {
//   return (
//     <div
//       className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4 h-full overflow-auto`}
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h3
//           className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-800"} flex items-center`}
//         >
//           <ClipboardList size={20} className="mr-2" />
//           Prescriptions
//         </h3>
//         <button
//           onClick={() => setIsPrint(true)}
//           className={`flex items-center gap-2 px-3 py-2 rounded-md ${
//             darkMode
//               ? "bg-yellow-700 hover:bg-yellow-600 text-white"
//               : "bg-yellow-500 hover:bg-yellow-600 text-white"
//           } transition-colors`}
//         >
//           <Printer size={16} />
//           <span>Print</span>
//         </button>
//       </div>

//       <div className="space-y-4">
//         {dummyAppointment.prescription.map((p, i) => (
//           <div
//             key={i}
//             className={`p-4 rounded-lg border ${
//               darkMode
//                 ? "border-gray-600 bg-gray-800"
//                 : "border-gray-200 bg-gray-50"
//             } hover:shadow-md transition-shadow duration-200`}
//           >
//             <div className="flex justify-between items-start">
//               <h4
//                 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
//               >
//                 {p.name}
//               </h4>
//               <span
//                 className={`text-xs px-2 py-1 rounded ${i === 0 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}`}
//               >
//                 {i === 0 ? "Primary" : "Supplementary"}
//               </span>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
//               <div
//                 className={`p-3 rounded ${darkMode ? "bg-gray-700" : "bg-white"}`}
//               >
//                 <p
//                   className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                 >
//                   Dosage
//                 </p>
//                 <p
//                   className={`${darkMode ? "text-gray-300" : "text-gray-700"} mt-1`}
//                 >
//                   {p.dosage || "Not specified"}
//                 </p>
//               </div>
//               <div
//                 className={`p-3 rounded ${darkMode ? "bg-gray-700" : "bg-white"}`}
//               >
//                 <p
//                   className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                 >
//                   Duration
//                 </p>
//                 <p
//                   className={`${darkMode ? "text-gray-300" : "text-gray-700"} mt-1`}
//                 >
//                   {p.duration || "Not specified"}
//                 </p>
//               </div>
//             </div>
//             <div
//               className={`mt-3 p-3 rounded ${darkMode ? "bg-gray-700" : "bg-white"}`}
//             >
//               <p
//                 className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//               >
//                 Instructions
//               </p>
//               <p
//                 className={`${darkMode ? "text-gray-300" : "text-gray-700"} mt-1`}
//               >
//                 {i === 0
//                   ? "Take with food. Avoid alcohol while on this medication."
//                   : i === 1
//                     ? "May cause drowsiness. Do not drive after taking this medication."
//                     : "Take with a full glass of water. Do not take with antacids."}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 p-4 border border-dashed rounded-lg text-center border-gray-300 dark:border-gray-600">
//         <p
//           className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//         >
//           All prescriptions were issued on{" "}
//           {formatDate(dummyAppointment.created_at)}
//         </p>
//       </div>
//     </div>
//   );
// };

// Mock print component
// const PrescriptionsPrint = ({ setIsOpen }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Print Preview</h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X size={24} />
//           </button>
//         </div>
//         <div className="border p-4 rounded-lg bg-gray-50 h-96 overflow-auto">
//           <div className="text-center mb-6">
//             <h1 className="text-xl font-bold">Medical Prescription</h1>
//             <p className="text-gray-600">Dr. Smith • Medical Center</p>
//             <p className="text-gray-600">
//               Patient: Jane Doe • {formatDate(dummyAppointment.created_at)}
//             </p>
//           </div>
//           <div className="space-y-4">
//             {dummyAppointment.prescription.map((p, i) => (
//               <div key={i} className="border-b pb-3">
//                 <p className="font-semibold">
//                   {i + 1}. {p.name}
//                 </p>
//                 <p className="text-gray-700 ml-5">Dosage: {p.dosage}</p>
//                 <p className="text-gray-700 ml-5">Duration: {p.duration}</p>
//               </div>
//             ))}
//           </div>
//           <div className="mt-8 pt-4 border-t">
//             <p className="text-right font-semibold">Dr. Smith</p>
//             <p className="text-right text-gray-600">License #: MD12345</p>
//           </div>
//         </div>
//         <div className="mt-4 flex justify-end gap-3">
//           <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
//             Cancel
//           </button>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
//             <Printer size={16} />
//             Print
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
