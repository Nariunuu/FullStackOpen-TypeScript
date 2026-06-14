interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseArgs {
  target: number;
  dailyHours: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseArgs => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const numericArgs = args.slice(2).map(Number);
  if (numericArgs.some(isNaN)) {
    throw new Error('Provided values were not numbers!');
  }

  const [target, ...dailyHours] = numericArgs;
  return { target, dailyHours };
};

const rate = (
  average: number,
  target: number
): { rating: 1 | 2 | 3; ratingDescription: string } => {
  const ratio = average / target;
  if (ratio >= 1) return { rating: 3, ratingDescription: 'good, target reached' };
  if (ratio >= 0.75) return { rating: 2, ratingDescription: 'not too bad but could be better' };
  return { rating: 1, ratingDescription: 'you need to train more' };
};

const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(h => h > 0).length;
  const average = dailyHours.reduce((sum, h) => sum + h, 0) / periodLength;
  const success = average >= target;
  const { rating, ratingDescription } = rate(average, target);

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const isCli = import.meta.url === `file://${process.argv[1]}`;
if (isCli) {
  try {
    const { target, dailyHours } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

export { calculateExercises };
