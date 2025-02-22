import { useForm } from "react-hook-form";
import Input from "../components/comman/formFaild/Input";
import Select from "../components/comman/formFaild/Select";

import { invoke } from "@tauri-apps/api/core";
interface IFormInput {
  name: string;
  dob: string;
  gender: string;
  occupation: string;
  residence: string;
  born_city: string;
  tel: string;
  email: string;
  marital: string;
  smoker: string;
  si: string;
  special_habits: string;
}
function AddPatient() {
  const {
    register,
    handleSubmit,
    // formState: { errors, isSubmitting },
    // reset,
  } = useForm<IFormInput>({
    //resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });
  const onSubmitHandler = async (data: IFormInput) => {
    try {
      const res = await invoke("add_patient", { data });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <h1>Add Patient</h1>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        noValidate
        autoComplete="off"
      >
        <Input label="Name" name="name" register={register} />
        <Input label="DOB" name="dob" register={register} />
        <Select
          label="Gender"
          name="gender"
          register={register}
          options={["Male", "Fmale"]}
        />
        <Input label="Occupation" name="occupation" register={register} />
        <Input label="Residence" name="residence" register={register} />
        <Input label="Born City" name="born_city" register={register} />
        <Select
          label="Marital Status"
          name="marital"
          register={register}
          options={["Single", "Married", "Widowed", "Divorced"]}
        />
        <Input label="SI" name="si" register={register} />
        <Select
          label="Smoker"
          name="smoker"
          register={register}
          options={["No", "Yes"]}
        />
        <Input label="Tel" name="tel" register={register} />
        <Input label="Email" name="email" register={register} />
        <Input
          label="Special Habits"
          name="special_habits"
          register={register}
        />
        <button
          className="font-bold text-white bg-blue-700 px-16 py-4 rounded-md "
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default AddPatient;
