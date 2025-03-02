import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../formFaild/Input";
import Select from "../formFaild/Select";
import DateInput from "../formFaild/DateInput";
import {
  patientInfoSchema,
  TPatientInfo,
} from "../../../validations/patientInfoSchema";

type TFormProps = {
  onSubmitHandler: (data: TPatientInfo) => void;
  btnText?: string;
  patientInfo?: TPatientInfo;
  onCancel?: () => void;
};
function Form({ onSubmitHandler, btnText, patientInfo, onCancel }: TFormProps) {
  const {
    register,
    handleSubmit,
    control,

    formState: { errors, isSubmitting },
    reset,
  } = useForm<TPatientInfo>({
    resolver: zodResolver(patientInfoSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (patientInfo) {
      const formattedPatientInfo = {
        ...patientInfo,
        dob:
          patientInfo.dob instanceof Date
            ? patientInfo.dob
            : new Date(patientInfo.dob),
      };
      reset(formattedPatientInfo);
    }
  }, [patientInfo, reset]);

  return (
    <form
      className="px-8 mt-8 h-[100%]"
      onSubmit={handleSubmit(onSubmitHandler)}
      noValidate
    >
      <div className="md:flex gap-16">
        <div className="md:flex flex-col md:gap-4 md:w-1/2 ">
          <Input
            label="Name"
            name="name"
            register={register}
            error={errors.name?.message}
          />
          <Select
            label="Gender"
            name="gender"
            control={control}
            options={["Male", "Fmale"]}
          />
          <Input label="Born City" name="born_city" register={register} />
          <Input label="Residence" name="residence" register={register} />

          <Select
            label="Marital Status"
            name="marital"
            control={control}
            options={["Single", "Married", "Widowed", "Divorced"]}
          />
          <DateInput label="DOB" name="dob" control={control} />
        </div>
        <div className="md:flex flex-col gap-4 md:w-1/2">
          <Input
            label="Tel"
            name="tel"
            register={register}
            error={errors.tel?.message}
          />
          <Input label="Email" name="email" register={register} />
          <Input label="Occupation" name="occupation" register={register} />
          <Input label="SI" name="si" register={register} />
          <Select
            label="Smoker"
            name="smoker"
            control={control}
            options={["No", "Yes"]}
          />
          <Input
            label="Special Habits"
            name="special_habits"
            register={register}
          />
        </div>
      </div>
      <div className="flex justify-around my-8">
        <button
          disabled={isSubmitting}
          className="font-bold text-white bg-blue-500 hover:bg-blue-700  py-4 rounded-md  w-1/3 "
          type="submit"
        >
          {btnText}
        </button>
        <button
          className="font-bold text-white bg-red-500 hover:bg-red-700  py-4 rounded-md  w-1/3 "
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default Form;
