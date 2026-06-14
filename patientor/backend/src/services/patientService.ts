import { v1 as uuid } from 'uuid';
import patients from '../data/patients.ts';
import type { Entry, NewEntry, NewPatient, NonSensitivePatient, Patient } from '../types.ts';

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

const addEntry = (patientId: string, entry: NewEntry): Entry | undefined => {
  const patient = findById(patientId);
  if (!patient) return undefined;
  const newEntry: Entry = { id: uuid(), ...entry };
  patient.entries.push(newEntry);
  return newEntry;
};

export default { getNonSensitive, findById, addPatient, addEntry };
