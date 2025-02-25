import { Path, FieldValues, UseFormRegister } from "react-hook-form";

type TProps<T extends FieldValues> = {
  label: string;
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
  return (
    <label className="block w-full dark:text-white relative " htmlFor={name}>
      {label}
      <input
        type={type}
        id={name}
        {...register(name)}
        className="block w-full mt-1 mb-2 px-2 py-2 rounded-md focus:outline-none
                   border border-gray-400  focus:border-blue-light text-gray-700 bg-gray-100"
      />

      <p className="text-red-500 text-sm mb-4">{error}</p>
    </label>
  );
}

export default Input;
