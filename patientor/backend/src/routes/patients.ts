import express from 'express';
import patientService from '../services/patientService.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getNonSensitive());
});

export default router;
