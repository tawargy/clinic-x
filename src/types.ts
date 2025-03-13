// export type TPatientInfo = {
//   id: string;
//   name?: string;
//   dob?: string;
//   age?: string;
//   gender?: string;
//   height?: string;
//   weight?: string;
//   bloodPressure?: string;
//   heartRate?: string;
//   marital?: string;
//   bornCity?: string;
//   occupation?: string;
//   temperature?: string;
//   allergies?: string[];
//   medications?: string[];
//   conditions?: string[];
//   specialHabits?: string[];
//   notes?: string;
//   history?: {
//     date?: string;
//     reason?: string;
//     diagnosis?: string;
//     treatment?: string;
//     doctor?: string;
//   }[];
//   contactInfo?: {
//     phone?: string;
//     email?: string;
//     address?: string;
//   };
//   insurance?: {
//     provider?: string;
//     policyNumber?: string;
//     groupNumber?: string;
//   };
// };

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

export type TpatientMedicalHistory = {
  id: string;
  patient_id: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  special_habits?: string[];
  past_history?: string;
  family_history?: string;
  notes?: string;
};
