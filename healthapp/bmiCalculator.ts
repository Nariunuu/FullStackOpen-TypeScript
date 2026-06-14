interface BmiArgs {
  height: number;
  weight: number;
}

const parseBmiArguments = (args: string[]): BmiArgs => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error('Provided values were not numbers!');
  }

  return { height, weight };
};

const calculateBmi = (heightCm: number, weightKg: number): string => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 16.0) return 'Underweight (Severe thinness)';
  if (bmi < 17.0) return 'Underweight (Moderate thinness)';
  if (bmi < 18.5) return 'Underweight (Mild thinness)';
  if (bmi < 25.0) return 'Normal range';
  if (bmi < 30.0) return 'Overweight (Pre-obese)';
  if (bmi < 35.0) return 'Obese (Class I)';
  if (bmi < 40.0) return 'Obese (Class II)';
  return 'Obese (Class III)';
};

try {
  const { height, weight } = parseBmiArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export { calculateBmi };
