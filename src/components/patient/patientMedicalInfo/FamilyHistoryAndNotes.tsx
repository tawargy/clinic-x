import { useState, useEffect } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { TpatientMedicalHistory } from "../../../types";
import { Pencil, Save, X } from "lucide-react";

type TProps = {
  patientMedicalHistory: TpatientMedicalHistory;
  setPatientMedicalHistory: React.Dispatch<
    React.SetStateAction<TpatientMedicalHistory>
  >;
  originalData: TpatientMedicalHistory;
  onSave: (data: TpatientMedicalHistory) => Promise<void>;
};
function FamilyHistoryAndNotes({
  patientMedicalHistory,
  setPatientMedicalHistory,
  originalData,
  onSave,
}: TProps) {
  const { darkMode } = useAppSettings();

  const [isFamilyHistoryEdit, setIsFamilyHistoryEdit] = useState(false);
  const [isNotesEdit, setIsNotesEdit] = useState(false);
  const [familyHistory, setFamilyHistory] = useState<string | undefined>(
    undefined,
  );
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [expandedSections, setExpandedSections] = useState({
    familyHistory: true,
    notes: true,
  });

  useEffect(() => {
    setFamilyHistory(patientMedicalHistory.family_history || undefined);
    setNotes(patientMedicalHistory.notes || undefined);
  }, [patientMedicalHistory]);

  useEffect(() => {
    if (isFamilyHistoryEdit) {
      setPatientMedicalHistory((prev) => ({
        ...prev,
        family_history: familyHistory,
      }));
    }
  }, [familyHistory, isFamilyHistoryEdit]);

  // Update parent state when notes change
  useEffect(() => {
    if (isNotesEdit) {
      setPatientMedicalHistory((prev) => ({
        ...prev,
        notes: notes,
      }));
    }
  }, [notes, isNotesEdit]);

  // Fix the toggle section function by using a specific type for section
  type SectionKey = "familyHistory" | "notes";
  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFamilyHistorySave = async () => {
    await onSave(patientMedicalHistory);
    setIsFamilyHistoryEdit(false);
  };

  const handleFamilyHistoryCancel = () => {
    setFamilyHistory(originalData.family_history || undefined);
    setPatientMedicalHistory((prev) => ({
      ...prev,
      family_history: originalData.family_history,
    }));
    setIsFamilyHistoryEdit(false);
  };

  // Notes handlers
  const handleNotesSave = async () => {
    await onSave(patientMedicalHistory);
    setIsNotesEdit(false);
  };

  const handleNotesCancel = () => {
    setNotes(originalData.notes || undefined);
    setPatientMedicalHistory((prev) => ({
      ...prev,
      notes: originalData.notes,
    }));
    setIsNotesEdit(false);
  };
  const down = <span className="text-green-500">▼</span>;
  const up = <span>▲ </span>;
  return (
    <div>
      {/* Family History Section */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} w-full rounded-lg shadow-md p-2 mb-1
            max-h-[300px] overflow-y-auto custom-scrollbar
            transition-colors duration-200`}
      >
        <div className="flex items-center justify-between mb-2">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleSection("familyHistory")}
          >
            <h4
              className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Family History
            </h4>
            <span className="ml-2 text-gray-400">
              {expandedSections.familyHistory ? down : up}
            </span>
          </div>

          {/* Family History Edit Controls */}
          {isFamilyHistoryEdit ? (
            <div className="flex items-center gap-2">
              <span
                onClick={handleFamilyHistorySave}
                className="cursor-pointer"
              >
                <Save
                  className="text-green-400 hover:text-green-500"
                  size={22}
                />
              </span>
              <span
                onClick={handleFamilyHistoryCancel}
                className="cursor-pointer"
              >
                <X className="text-red-400 hover:text-red-500" size={22} />
              </span>
            </div>
          ) : (
            <span
              onClick={() => {
                setIsFamilyHistoryEdit(true);
                setExpandedSections((prev) => ({
                  ...prev,
                  familyHistory: true,
                }));
              }}
              className="cursor-pointer"
            >
              <Pencil
                className="text-gray-500 hover:text-green-500"
                size={20}
              />
            </span>
          )}
        </div>

        {expandedSections.familyHistory && (
          <div>
            {isFamilyHistoryEdit ? (
              <textarea
                className={`${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                value={familyHistory || ""}
                onChange={(e) => setFamilyHistory(e.target.value)}
                placeholder="Enter family history details"
              />
            ) : (
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {familyHistory || "No family history recorded"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} w-full rounded-lg shadow-md p-2 mb-1
            max-h-[300px] overflow-y-auto custom-scrollbar
            transition-colors duration-200`}
      >
        <div className="flex items-center justify-between mb-2">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleSection("notes")}
          >
            <h4
              className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Notes
            </h4>
            <span className="ml-2 text-gray-400">
              {expandedSections.notes ? down : up}
            </span>
          </div>

          {/* Notes Edit Controls */}
          {isNotesEdit ? (
            <div className="flex items-center gap-2">
              <span onClick={handleNotesSave} className="cursor-pointer">
                <Save
                  className="text-green-400 hover:text-green-500"
                  size={22}
                />
              </span>
              <span onClick={handleNotesCancel} className="cursor-pointer">
                <X className="text-red-400 hover:text-red-500" size={22} />
              </span>
            </div>
          ) : (
            <span
              onClick={() => {
                setIsNotesEdit(true);
                setExpandedSections((prev) => ({
                  ...prev,
                  notes: true,
                }));
              }}
              className="cursor-pointer"
            >
              <Pencil
                className="text-gray-500 hover:text-green-500"
                size={20}
              />
            </span>
          )}
        </div>

        {expandedSections.notes && (
          <div>
            {isNotesEdit ? (
              <textarea
                className={`${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                value={notes || ""}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter additional notes"
              />
            ) : (
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {notes || "No additional notes"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FamilyHistoryAndNotes;
