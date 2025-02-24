import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../components/comman/formFaild/Input";
import Select from "../components/comman/formFaild/Select";
import { FaWindowClose } from "react-icons/fa";

import { invoke } from "@tauri-apps/api/core";
interface IFormInput {
  id: string;
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
  const navigate = useNavigate();
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
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container mx-auto   bg-white rounded-lg shadow-lg dark:bg-bg-dark  dark:shadow-blue-500/50 pb-2 relative">
      <div className=" w-7 h-7 flex items-center justify-center bg-white p-[1px] rounded-md absolute right-3 top-3  cursor-pointer">
        <FaWindowClose
          onClick={() => navigate("/")}
          className="w-full h-full text-red-500"
        />
      </div>
      <h1 className="text-center text-xl text-white bg-blue-700 py-4 rounded-t-md">
        Add Patient
      </h1>
      <form
        className="px-8 mt-8"
        onSubmit={handleSubmit(onSubmitHandler)}
        noValidate
        autoComplete="on"
      >
        <div className="md:flex gap-16 ">
          <input type="hidden" {...register("id")} />
          <Input label="Name" name="name" register={register} />
          <Input label="DOB" name="dob" register={register} />
        </div>
        <div className="md:flex gap-16 ">
          <Select
            label="Gender"
            name="gender"
            register={register}
            options={["Male", "Fmale"]}
          />
          <Input label="Occupation" name="occupation" register={register} />
        </div>
        <div className="md:flex gap-16 ">
          <Input label="Residence" name="residence" register={register} />
          <Input label="Born City" name="born_city" register={register} />
        </div>
        <div className="md:flex gap-16 ">
          <Select
            label="Marital Status"
            name="marital"
            register={register}
            options={["Single", "Married", "Widowed", "Divorced"]}
          />
          <Input label="SI" name="si" register={register} />
        </div>
        <div className="md:flex gap-16 ">
          <Select
            label="Smoker"
            name="smoker"
            register={register}
            options={["No", "Yes"]}
          />
          <Input label="Tel" name="tel" register={register} />
        </div>
        <div className="md:flex gap-16 ">
          <Input label="Email" name="email" register={register} />
          <Input
            label="Special Habits"
            name="special_habits"
            register={register}
          />
        </div>
        <button
          className="font-bold text-white bg-blue-700 px-16 py-4 rounded-md block w-1/3 m-auto my-8"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
}
export default AddPatient;
