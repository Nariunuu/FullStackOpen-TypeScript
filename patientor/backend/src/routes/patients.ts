import express from 'express';
import { z } from 'zod';
import patientService from '../services/patientService.ts';
import toNewPatient, { toNewEntry } from '../utils.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getNonSensitive());
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const added = patientService.addEntry(req.params.id, newEntry);
    if (!added) {
      return res.status(404).send('Patient not found');
    }
    return res.json(added);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(z.prettifyError(error));
    }
    return res.status(400).send('Unknown error');
  }
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
