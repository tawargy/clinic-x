import { TAppointment, TAppointmentWrapper, TDiagnosis } from "./types";

export const patientInit = {
  id: "",
  name: "",
  dob: "",
  age: "",
  gender: "",
  marital_status: "",
  born_city: "",
  residence: "",
  occupation: "",
  phone: "",
  email: "",
  insurance_provider: "",
  insurance_policy_number: "",
  insurance_groub_number: "",
};
export const patientMedicalHistoryInit = {
  id: "",
  patient_id: "",
  allergies: [],
  medications: [{ med_name: "", dosage: "" }],

  conditions: [],
  special_habits: [],
  past_history: "",
  family_history: "",
  notes: "",
};
export const appointmentInit: TAppointment = {
  id: "",
  patient_id: "",
  vitals: [],
  complaint: "",
  present_history: "",
  examination: "",
  provisional_diagnosis: "",
  prescription: [],
  requests: "",
  services: "",
  created_at: new Date().toISOString(),
};
export const appointmentWrapperInit: TAppointmentWrapper = {
  id: "",
  patient_id: "",
  main_complaint: "",
  main_appointment: "",
  followups_num: "",
  followup_appointments: [],
  appointment_status: "",
  date: "",
};
export const diagnosisInit: TDiagnosis = {
  diagnosis_type: "",
  diagnosis_title: "",
  start: "",
  end: "",
  ongoing: false,
  comment: "",
};

export const patientInfoQInit = {
  patient_id: "",
  name: "",
  appointment_type: "",
  description: "",
};
export const prescriptionsInit = {
  name: "",
  dosage: "10mg",
  frequency: "daily",
  duration: "1 month",
};
export const clinicInfoInit = {
  id: "",
  clinic_name: "",
  speciality: "",
  memberships: [""],
  address: "",
  contactus: [""],
  appointments: {
    from: "",
    to: "",
    excepting: [""],
  },
};
export const dummyClinicInfoInit = {
  id: "",
  clinic_name: "د.عمرو نصر عثمان",
  speciality: "استشارى القلب والاوعية الدموي والامراض الباطنيةة ",
  memberships: [
    "زمالة القلب والاوعية الدموية",
    "كلية طب القصر العينى جامعة القاهرة",
  ],
  address: " عزبة البرج شارع الفنار اول شارع قاصد كريم",
  contactus: ["01274779208"],
  appointments: {
    from: "5:00 PM",
    to: "10:00 PM",
    excepting: ["الجمعة"],
  },
};
export const employeeInit = {
  id: "",
  name: "",
  phone: "",
  address: "",
  sallary: 0,
  roull: "",
  n_id: "",
};
