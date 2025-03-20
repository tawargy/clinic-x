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
  medications: [],
  conditions: [],
  special_habits: [],
  past_history: "",
  family_history: "",
  notes: "",
};
export const appointmentInit = {
  id: "",
  patient_id: "",
  complaint: "",
  present_history: "",
  examination: "",
  provisional_diagnosis: "",
  past_history: "",
  bp: "",
  p: "",
  t: "",
  rr: "",
  rbs: "",
  spo2: "",
  weight: "",
  height: "",
  prescription: [],
  created_at: new Date().toISOString(),
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
export const clinicManagmentInit = {
  id: "",
  clinic_name: "",
  speciality: "",
  memberships: [""],
  address: "",
  contactus: [""],
  appointments: {
    from: "",
    to: "",
    excepting: "",
  },
};
export const dummyClinicManagmentInit = {
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
    from: "يوميا من 5:30 ظهرا",
    to: "10:00",
    excepting: "الجمعة",
  },
};
