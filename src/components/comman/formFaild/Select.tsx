import { Path, FieldValues, UseFormRegister } from "react-hook-form";

type SlectProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  options?: string[];
  error?: string;
};

function Select<T extends FieldValues>({
  label,
  name,
  register,
  options,
  error,
}: SlectProps<T>) {
  return (
    <div className="w-full">
      <label className="block w-full text-green-darker " htmlFor={name}>
        {label}
        <select
          className="block w-full mt-2 mb-4 px-2 py-4 rounded-md focus:outline-none  border border-gray-400  focus:border-blue-light   text-gray-700 bg-gray-100"
          id={name}
          {...register(name)}
        >
          {options?.map((option) => (
            <option key={option} value={option} className="bg-gray-100">
              {option}
            </option>
          ))}
        </select>
      </label>
      <p className="text-red-500 text-sm mb-4">{error}</p>
    </div>
  );
}

export default Select;
