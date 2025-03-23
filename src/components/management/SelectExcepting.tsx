import Select from "react-select"; // Import at the top
import { useAppSettings } from "../../contextApi/appContext";

// Add these types
type TOption = {
  value: string;
  label: string;
};
type TProps = {
  setExcepting: (days: string[]) => void;
  excepting: string[];
};

function SelectExcepting({ setExcepting, excepting }: TProps) {
  const { darkMode } = useAppSettings();
  const daysOptions: TOption[] = [
    { value: "الاحد", label: "الاحد" },
    { value: "الاثنين", label: "الاثنين" },
    { value: "الثلاثاء", label: "الثلاثاء" },
    { value: "الاربعاء", label: "الاربعاء" },
    { value: "الخميس", label: "الخميس" },
    { value: "الجمعة", label: "الجمعة" },
    { value: "السبت", label: "السبت" },
  ];

  return (
    <div>
      <label htmlFor="excepting">Excepting Days</label>
      <div className="flex gap-2 mb-2">
        <Select
          isMulti
          name="excepting"
          options={daysOptions}
          className="basic-multi-select w-full"
          classNamePrefix="select"
          value={daysOptions.filter((option) =>
            excepting.includes(option.value),
          )}
          onChange={(selectedOptions) => {
            const selectedValues = (selectedOptions as TOption[]).map(
              (option) => option.value,
            );
            setExcepting(selectedValues);
          }}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: darkMode ? "#374151" : "white",
              borderColor: darkMode ? "#4B5563" : "#D1D5DB",
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: darkMode ? "#374151" : "white",
            }),
            option: (baseStyles, { isFocused, isSelected }) => ({
              ...baseStyles,
              backgroundColor: isSelected
                ? "#2563EB"
                : isFocused
                  ? darkMode
                    ? "#4B5563"
                    : "#E5E7EB"
                  : darkMode
                    ? "#374151"
                    : "white",
              color: isSelected ? "white" : darkMode ? "white" : "black",
            }),
            multiValue: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: darkMode ? "#4B5563" : "#E5E7EB",
            }),
            multiValueLabel: (baseStyles) => ({
              ...baseStyles,
              color: darkMode ? "white" : "black",
            }),
            multiValueRemove: (baseStyles) => ({
              ...baseStyles,
              ":hover": {
                backgroundColor: darkMode ? "#374151" : "#D1D5DB",
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
export default SelectExcepting;
