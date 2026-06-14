import diagnoses from '../data/diagnoses.ts';
import type { Diagnosis } from '../types.ts';

const getAll = (): Diagnosis[] => diagnoses;

export default { getAll };
