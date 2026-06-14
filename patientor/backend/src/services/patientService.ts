import { v1 as uuid } from 'uuid';
import patients from '../data/patients.ts';
import type { NewPatient, NonSensitivePatient, Patient } from '../types.ts';

const getNonSensitive = (): NonSensitivePatient[] =>
  patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));

const findById = (id: string): Patient | undefined =>
  patients.find(p => p.id === id);

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = { id: uuid(), entries: [], ...entry };
  patients.push(newPatient);
  return newPatient;
};

export default { getNonSensitive, findById, addPatient };
