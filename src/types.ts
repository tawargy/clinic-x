export type TPatientInfo = {
  id: string;
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  bloodPressure: string;
  heartRate: string;
  marital: string;
  bornCity: string;
  occupation: string;
  temperature: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  specialHabits: string[];
  notes: string;
  history: {
    date: string;
    reason: string;
    diagnosis: string;
    treatment: string;
    doctor: string;
  }[];
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
};
