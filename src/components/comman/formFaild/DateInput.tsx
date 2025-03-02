import { Path, FieldValues, Control, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppSettings } from "../../../contextApi/appContext";

type TProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
};

function DateInput<T extends FieldValues>({
  label,
  name,
  control,
  error,
}: TProps<T>) {
  const { darkMode } = useAppSettings();
  return (
    <div className="block w-full dark:text-white">
      <span className="block mb-0">{label}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            onChange={(date) => field.onChange(date)}
            selected={field.value ? new Date(field.value) : null}
            dateFormat="dd-MM-yyyy"
            className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}  block w-full mt-0 mb-1 px-2 py-2 rounded-md focus:outline-none
              border border-gray-400 focus:border-blue-light text-gray-700 bg-gray-100`}
            placeholderText="DD-MM-YYYY"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
          />
        )}
      />
      <p className="text-red-500 text-sm mb-4">{error}</p>
    </div>
  );
}

export default DateInput;
