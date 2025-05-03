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
  family_history?: string;
  notes?: string;
};
export type TAppointmentWrapper = {
  id: string;
  patient_id: string;
  main_complaint: string;
  main_appointment: string;
  followups_num: string;
  followup_appointments: string[];
  appointment_status: string;
  date: string;
};
export type TVitals = {
  v_name: string;
  v_value: string;
};
export type TAppointment = {
  id: string;
  patient_id: string;
  vitals: TVitals[];
  complaint: string;
  present_history: string;
  examination: string;
  provisional_diagnosis: string; // FOREIGN Key diagnosis
  prescription: TPrescription[];
  requests: string; // FOREIGN Key Requests
  services: string;
  created_at: string;
};

//appointment_followups: string[];
//appointment_status: string;
//fee: string;
//services: TService[];
export type TPrescription = {
  name?: string;
  dosage?: string;
  duration?: string;
};
export type TPatientInfoQ = {
  patient_id: string;
  name: string;
  appointment_type: string;
  description: string;
  time: string;
};
export type TAppointmentFees = {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  appointment_type: string;
  fee: string;
  services: TService[];
  total_fees: string;
  date: string;
  time_stamp: string;
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
  role: string;
  salary: string;
};
export type TFeeAndServices = {
  id: string;
  fee: string;
  followups: TFollowup[];
  services: TService[];
};
export type TFollowup = {
  followup_name: string;
  followup_fee: string;
};
export type TService = {
  service_name: string;
  service_fee: string;
};

export type TDiagnoses = {
  id: string;
  patient_id: string;
  diagnoses: TDiagnosis[];
  date: string;
};
export type TDiagnosis = {
  id: string;
  diagnosis_type: string; // chronic or Non-chronic
  diagnosis_title: string;
  start: string;
  end?: string;
  ongoing?: boolean;
  comment: string;
  created_at: string;
};
export type TRequest = {
  id: string;
  req_date: string;
  req_name: string;
  comment: string;
  req_type: string;
  resualt?: string;
};

export type Purchase = {
  item_name: string;
  price: string;
};

export type Installment = {
  insinternet_name: string;
  value: string;
};
export type OtherExpense = {
  other_expense_name: string;
  value: string;
};
export type TExpenses = {
  id: string;
  month: string;
  rent: string;
  taxes: string;
  electricity_invoice: string;
  water_invoice: string;
  phone_and_internet_invoice: string;
  purchases: Array<Purchase>;
  installments: Array<Installment>;
  other_expenses: Array<OtherExpense>;
};
