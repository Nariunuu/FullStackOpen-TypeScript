import express from 'express';
import { z } from 'zod';
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
    if (error instanceof z.ZodError) {
      res.status(400).send(z.prettifyError(error));
    } else {
      res.status(400).send('Unknown error');
    }
  }
});

export default router;
