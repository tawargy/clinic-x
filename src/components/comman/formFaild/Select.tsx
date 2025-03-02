import {
  Path,
  FieldValues,
  UseFormRegister,
  Control,
  Controller,
} from "react-hook-form";
import { useAppSettings } from "../../../contextApi/appContext";
import ReactSelect from "react-select";

type SelectProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>; // Add this
  options?: string[];
  error?: string;
};

function Select<T extends FieldValues>({
  label,
  name,
  control, // Add this
  options,
  error,
}: SelectProps<T>) {
  const { darkMode } = useAppSettings();

  // Convert string[] to format required by React Select
  const selectOptions = options?.map((option) => ({
    value: option,
    label: option,
  }));

  // Custom styles for dark/light mode
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#374151" : "#f9fafb",
      borderColor: darkMode ? "#4B5563" : "#D1D5DB",
      color: darkMode ? "white" : "black",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#374151" : "#f9fafb",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? darkMode
          ? "#4B5563"
          : "#D1D5DB"
        : darkMode
          ? "#374151"
          : "#f9fafb",
      color: darkMode ? "white" : "black",
      "&:hover": {
        backgroundColor: darkMode ? "#4B5563" : "#D1D5DB",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: darkMode ? "white" : "black",
    }),
  };

  return (
    <div className="w-full">
      <label className="block w-full dark:text-white" htmlFor={name}>
        {label}

        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <ReactSelect
              ref={ref}
              options={selectOptions}
              value={selectOptions?.find((option) => option.value === value)}
              onChange={(option) => onChange(option?.value)}
              styles={customStyles}
              className="mt-1"
              classNamePrefix="select"
            />
          )}
        />
      </label>
      <p className="text-red-500 text-sm mb-4">{error}</p>
    </div>
  );
}

export default Select;

// import { Path, FieldValues, UseFormRegister } from "react-hook-form";

// import { useAppSettings } from "../../../contextApi/appContext";

// type SlectProps<T extends FieldValues> = {
//   label: string;
//   name: Path<T>;
//   register: UseFormRegister<T>;
//   options?: string[];
//   error?: string;
// };

// function Select<T extends FieldValues>({
//   label,
//   name,
//   register,
//   options,
//   error,
// }: SlectProps<T>) {
//   const { darkMode } = useAppSettings();
//   return (
//     <div className="w-full">
//       <label className="block w-full dark:text-white " htmlFor={name}>
//         {label}
//         <select
//           className={`${
//             darkMode
//               ? "!bg-gray-700 border-gray-600 text-white placeholder-gray-400"
//               : "!bg-gray-50 border-gray-300 text-gray-900"
//           } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
//           id={name}
//           {...register(name)}
//         >
//           {options?.map((option) => (
//             <option
//               key={option}
//               value={option}
//               className={darkMode ? "bg-gray-700" : "bg-gray-50"}
//             >
//               {option}
//             </option>
//           ))}
//         </select>
//       </label>
//       <p className="text-red-500 text-sm mb-4">{error}</p>
//     </div>
//   );
// }

// export default Select;
