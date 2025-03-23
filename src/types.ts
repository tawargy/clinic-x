export type TPatientInfo = {
  id?: string;
  name: string;
  dob?: string;
  age?: string;
  gender?: string;
  marital_status?: string;
  born_city?: string;
  residence?: string;
  occupation?: string;
  phone: string;
  email?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_group_number?: string;
};

export type TMed = {
  med_name: string;
  dosage: string;
};
export type TpatientMedicalHistory = {
  id: string;
  patient_id: string;
  allergies?: string[];
  medications?: TMed[];
  conditions?: string[];
  special_habits?: string[];
  past_history?: string;
  family_history?: string;
  notes?: string;
};

export type TAppointment = {
  id: string;
  patient_id: string;
  complaint: string;
  present_history: string;
  examination: string;
  provisional_diagnosis: string;
  past_history: string;
  bp: string;
  p: string;
  t: string;
  rr: string;
  rbs: string;
  spo2: string;
  weight: string;
  height: string;
  prescription: TPrescription[];
  created_at: string;
};

export type TPrescription = {
  name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
};
export type TPatientInfoQ = {
  patient_id: string;
  name: string;
  appointment_type: string;
  description: string;
};

export type TClinicInfo = {
  id: string;
  clinic_name: string;
  speciality: string;
  memberships: string[];
  address: string;
  contactus: string[];
  appointments: { from: string; to: string; excepting: string[] };
};

export type TEmployee = {
  id: string;
  name: string;
  n_id: string;
  phone: string;
  address: string;
  roull: string;
  sallary: number;
};
