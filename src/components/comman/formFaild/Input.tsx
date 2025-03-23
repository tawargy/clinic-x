import { Path, FieldValues, UseFormRegister } from "react-hook-form";
import { useAppSettings } from "../../../contextApi/appContext";

type TProps<T extends FieldValues> = {
  label?: string;
  name: Path<T>;
  type?: string;
  register: UseFormRegister<T>;
  error?: string;
};

function Input<T extends FieldValues>({
  label,
  name,
  type = "text",
  register,
  error,
}: TProps<T>) {
  const { darkMode } = useAppSettings();
  return (
    <label className="block w-full dark:text-white relative " htmlFor={name}>
      {label}
      <input
        type={type}
        id={name}
        {...register(name)}
        className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
      />

      <p className="text-red-500 text-sm mb-4">{error}</p>
    </label>
  );
}

export default Input;
