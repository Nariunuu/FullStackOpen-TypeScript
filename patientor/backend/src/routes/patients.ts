import express from 'express';
import patientService from '../services/patientService.ts';
import toNewPatient from '../utils.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getNonSensitive());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    res.json(patientService.addPatient(newPatient));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).send(message);
  }
});

export default router;
