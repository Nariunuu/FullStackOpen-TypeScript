import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!req.query.height || !req.query.weight || isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  return res.json({
    weight,
    height,
    bmi: calculateBmi(height, weight),
  });
});

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body as {
    daily_exercises: number[];
    target: number;
  };

  const result = calculateExercises(daily_exercises, target);
  res.json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
