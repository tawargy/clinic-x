import { Path, FieldValues, UseFormRegister } from "react-hook-form";

type TProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  type?: string;
  register: UseFormRegister<T>;
  error?: string;
};
function VInput<T extends FieldValues>({
  label,
  name,
  type = "text",
  register,
}: TProps<T>) {
  return (
    <label className="text-red-500" htmlFor={name}>
      {label}
      <input
        type={type}
        id={name}
        {...register(name)}
        className="w-[40px] py-2 ml-2 bg-gray-50 text-gray-800 border border-gray-400 rounded-md"
      />
    </label>
  );
}

export default VInput;
