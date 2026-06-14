import express from 'express';
import patientService from '../services/patientService.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getNonSensitive());
});

router.post('/', (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body as {
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: string;
    occupation: string;
  };

  const added = patientService.addPatient({ name, dateOfBirth, ssn, gender, occupation });
  res.json(added);
});

export default router;
