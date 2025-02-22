import { useForm } from "react-hook-form";
import Input from "../comman/formFaild/Input";
import TextArea from "../comman/formFaild/TextArea";
import VInput from "../comman/formFaild/VInput";
import { invoke } from "@tauri-apps/api/core";

interface IAppointmentForm {
  patient_id: string;
  past_history: string;
  family_history: string;
  complaint: string;
  present_history: string;
  examination: string;
  bp: string;
  p: string;
  t: string;
  rr: string;
  rbs: string;
  spo2: string;
  weight: string;
  height: string;
  provisional_diagnosis: string;
}

function AppointmentForm() {
  const {
    register,
    handleSubmit,
    // formState: { errors, isSubmitting },
    // reset,
  } = useForm<IAppointmentForm>({
    //resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });
  const onSubmitHandler = async (data: IAppointmentForm) => {
    const patient_id = "fdsfd54353";
    const formdata = { ...data, patient_id };
    try {
      const res = await invoke("add_appointment_data", { formdata });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextArea
          label="Past History"
          name="past_history"
          register={register}
        />
        <TextArea
          label="Family History"
          name="family_history"
          register={register}
        />
        <Input label="Complaint" name="complaint" register={register} />
        <TextArea
          label="Present History"
          name="present_history"
          register={register}
        />
        <TextArea label="Examination" name="examination" register={register} />
        <div>
          <span>Vitals</span>
          <div className="flex flex-wrap gap-8">
            <VInput label="BP" name="bp" register={register} />
            <VInput label="P" name="p" register={register} />
            <VInput label="T" name="t" register={register} />
            <VInput label="RR" name="rr" register={register} />
            <VInput label="RBS" name="rbs" register={register} />
            <VInput label="sPO2" name="spo2" register={register} />
            <VInput label="Weight" name="weight" register={register} />
            <VInput label="Height" name="height" register={register} />
          </div>
        </div>
        <Input
          label="Provisional Diagnosis"
          name="provisional_diagnosis"
          register={register}
        />
      </div>

      <p>Investigations: List ..</p>
      <button
        className="font-bold text-white bg-blue-700 px-16 py-4 rounded-md "
        type="submit"
      >
        Save
      </button>
    </form>
  );
}

export default AppointmentForm;
