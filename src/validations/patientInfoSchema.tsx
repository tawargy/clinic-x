import { z } from "zod";

const patientInfoSchema = z.object({
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
  marital_status: z.string().optional(),
  phone: z
    .string()
    .min(11, { message: "Telephone must be at least 11 Numbers" })
    .regex(/^\d{11}$/, {
      message: "Telephone must contain all numbers.",
    }),
});

type TPatientSchema = z.infer<typeof patientInfoSchema>;

export { patientInfoSchema, type TPatientSchema };
