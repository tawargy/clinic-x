import { Path, FieldValues, UseFormRegister } from "react-hook-form";

type TProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  type?: string;
  register: UseFormRegister<T>;
  error?: string;
};
function TextArea<T extends FieldValues>({
  label,
  name,
  type = "text",
  register,
}: TProps<T>) {
  return (
    <div>
      <label className="block w-full text-gray-600 " htmlFor={name}>
        {label}
        <textarea
          id={name}
          {...register(name)}
          className="block w-full mt-1 mb-2 px-2 py-1 rounded-md focus:outline-none
                     border border-gray-400  focus:border-blue-light text-gray-700 bg-gray-100"
        />
      </label>
    </div>
  );
}

export default TextArea;
