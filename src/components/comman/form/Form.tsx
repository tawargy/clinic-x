import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../formFaild/Input";
import Select from "../formFaild/Select";
import DateInput from "../formFaild/DateInput";
import {
  patientInfoSchema,
  TFormValue,
} from "../../../validations/patientInfoSchema";

type TFormProps = {
  onSubmitHandler: (data: TFormValue) => void;
  btnText?: string;
  patientInfo?: TFormValue;
};
function Form({ onSubmitHandler, btnText, patientInfo }: TFormProps) {
  const {
    register,
    handleSubmit,
    control,

    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFormValue>({
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
      className="px-8 mt-8"
      onSubmit={handleSubmit(onSubmitHandler)}
      noValidate
    >
      <div className="md:flex gap-16">
        <div className="md:flex flex-col gap-4 md:w-1/2 ">
          <Input
            label="Name"
            name="name"
            register={register}
            error={errors.name?.message}
          />
          <Select
            label="Gender"
            name="gender"
            register={register}
            options={["Male", "Fmale"]}
          />
          <Input label="Born City" name="born_city" register={register} />
          <Input label="Residence" name="residence" register={register} />

          <Select
            label="Marital Status"
            name="marital"
            register={register}
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
            register={register}
            options={["No", "Yes"]}
          />
          <Input
            label="Special Habits"
            name="special_habits"
            register={register}
          />
        </div>
      </div>

      <button
        disabled={isSubmitting}
        className="font-bold text-white bg-blue-700 px-16 py-4 rounded-md block w-1/3 m-auto my-8"
        type="submit"
      >
        {btnText}
      </button>
    </form>
  );
}

export default Form;
