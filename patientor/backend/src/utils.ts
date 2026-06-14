import { Gender } from './types.ts';
import type { NewPatient } from './types.ts';

const isString = (text: unknown): text is string => typeof text === 'string';

const isGender = (param: string): param is Gender =>
  Object.values(Gender).map(v => v.toString()).includes(param);

const parseString = (value: unknown, field: string): string => {
  if (!isString(value)) throw new Error(`Incorrect or missing ${field}`);
  return value;
};

const parseDate = (value: unknown): string => {
  if (!isString(value) || !Date.parse(value)) {
    throw new Error('Incorrect or missing dateOfBirth');
  }
  return value;
};

const parseGender = (value: unknown): Gender => {
  if (!isString(value) || !isGender(value)) {
    throw new Error('Incorrect or missing gender');
  }
  return value;
};

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    return {
      name: parseString(object.name, 'name'),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseString(object.ssn, 'ssn'),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation, 'occupation'),
    };
  }

  throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatient;
