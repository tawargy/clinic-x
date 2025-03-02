import { z } from "zod";

const patientInfoSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "User Name must be at least 3 characters" }),
  //dob: z.date().or(z.string()),
  dob: z.date().optional(),
  email: z.string().optional(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  residence: z.string().optional(),
  born_city: z.string().optional(),
  si: z.string().optional(),
  marital: z.string().optional(),
  smoker: z.string().optional(),
  special_habits: z.string().optional(),
  tel: z
    .string()
    .min(11, { message: "Telephone must be at least 11 Numbers" })
    .regex(/^\d{11}$/, {
      message: "Telephone must contain all numbers.",
    }),
});

type TPatientInfo = z.infer<typeof patientInfoSchema>;

export { patientInfoSchema, type TPatientInfo };
