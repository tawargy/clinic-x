import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../formFaild/Input";
import Select from "../formFaild/Select";
import DateInput from "../formFaild/DateInput";
import {
  patientInfoSchema,
  TPatientSchema,
} from "../../../validations/patientInfoSchema";

type TFormProps = {
  onSubmitHandler: (data: TPatientSchema) => void;
  btnText?: string;
  patientInfo?: TPatientSchema;
  onCancel?: () => void;
};
function Form({ onSubmitHandler, btnText }: TFormProps) {
  const {
    register,
    handleSubmit,
    control,

    formState: { errors, isSubmitting },
  } = useForm<TPatientSchema>({
    resolver: zodResolver(patientInfoSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      gender: "Male",
      born_city: "",
      residence: "",
      dob: new Date(),
      phone: "",
      email: "",
      occupation: "",
      marital_status: "Single",
    },
  });

  // useEffect(() => {
  //   if (patientInfo) {
  //     const formattedPatientInfo = {
  //       ...patientInfo,
  //       dob:
  //         patientInfo.dob instanceof Date
  //           ? patientInfo.dob
  //           : new Date(patientInfo.dob),
  //     };
  //     reset(formattedPatientInfo);
  //   }
  // }, [patientInfo, reset]);

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

          <DateInput label="DOB" name="dob" control={control} />
        </div>
        <div className="md:flex flex-col gap-4 md:w-1/2">
          <Input
            label="Tel"
            name="phone"
            register={register}
            error={errors.phone?.message}
          />
          <Input label="Email" name="email" register={register} />
          <Input label="Occupation" name="occupation" register={register} />
          <Select
            label="Marital Status"
            name="marital_status"
            control={control}
            options={["Single", "Married", "Widowed", "Divorced"]}
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
      </div>
    </form>
  );
}

export default Form;
