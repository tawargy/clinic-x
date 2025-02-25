import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/comman/formFaild/Input";
import Select from "../components/comman/formFaild/Select";
import DateInput from "../components/comman/formFaild/DateInput";
import { FaWindowClose } from "react-icons/fa";
import { toastSuccess, toastError } from "../utils/toastify";

import { invoke } from "@tauri-apps/api/core";
interface IFormInput {
  id: string;
  name: string;
  dob: Date;
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

const patientSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, { message: "User Name must be at least 3 characters" }),
  dob: z.date(),
  email: z.string(),
  gender: z.string(),
  occupation: z.string(),
  residence: z.string(),
  born_city: z.string(),
  si: z.string(),
  marital: z.string(),
  smoker: z.string(),
  special_habits: z.string(),
  tel: z
    .string()
    .min(11, { message: "Telephone must be at least 11 Numbers" })
    .regex(/^\d{11}$/, {
      message: "Telephone must contain all numbers.",
    }),
});

function AddPatient() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    // reset,
  } = useForm<IFormInput>({
    resolver: zodResolver(patientSchema),
    mode: "onBlur",
    defaultValues: {
      id: "",
      name: "",
      dob: new Date(),
      gender: "",
      occupation: "",
      residence: "",
      born_city: "",
      tel: "",
      email: "",
      marital: "Single",
      smoker: "No",
      si: "",
      special_habits: "",
    },
  });
  const onSubmitHandler = async (data: IFormInput) => {
    try {
      const formattedData = {
        ...data,
        // dob: data.dob.toISOString().split("T")[0], // Format date to YYYY-MM-DD
        dob: data.dob.toLocaleDateString("en-GB"), // This will format to DD/MM/YYYY
      };
      //  replace / with - in the date string
      formattedData.dob = formattedData.dob.replace(/\//g, "-");
      const res = await invoke("add_patient", { data: formattedData });
      console.log(res);
      toastSuccess("Successfully added patient");
      navigate("/");
    } catch (e) {
      toastError("Failed to add patient");
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
          Save
        </button>
      </form>
    </div>
  );
}
export default AddPatient;
