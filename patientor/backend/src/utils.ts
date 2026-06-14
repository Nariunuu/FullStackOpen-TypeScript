import { z } from 'zod';
import { Gender } from './types.ts';
import type { NewPatient } from './types.ts';

const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.enum([Gender.Male, Gender.Female, Gender.Other]),
  occupation: z.string(),
});

const toNewPatient = (object: unknown): NewPatient => newPatientSchema.parse(object);

export default toNewPatient;
