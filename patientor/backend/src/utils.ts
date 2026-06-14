import { z } from 'zod';
import { Gender, HealthCheckRating } from './types.ts';
import type { NewEntry, NewPatient } from './types.ts';

const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.enum([Gender.Male, Gender.Female, Gender.Other]),
  occupation: z.string(),
});

export const toNewPatient = (object: unknown): NewPatient =>
  newPatientSchema.parse(object);

const baseEntryFields = {
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
};

const hospitalEntrySchema = z.object({
  ...baseEntryFields,
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string(),
  }),
});

const occupationalHealthcareEntrySchema = z.object({
  ...baseEntryFields,
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date(),
    })
    .optional(),
});

const healthCheckEntrySchema = z.object({
  ...baseEntryFields,
  type: z.literal('HealthCheck'),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
  ]),
});

const newEntrySchema = z.discriminatedUnion('type', [
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
  healthCheckEntrySchema,
]);

export const toNewEntry = (object: unknown): NewEntry => newEntrySchema.parse(object);

export default toNewPatient;
