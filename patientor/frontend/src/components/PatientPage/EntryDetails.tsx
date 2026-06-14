import { Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import {
  HealthCheckRating,
  type Diagnosis,
  type Entry,
  type HealthCheckEntry,
  type HospitalEntry,
  type OccupationalHealthcareEntry,
} from '../../types';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry: ${JSON.stringify(value)}`);
};

const ratingColor = (rating: HealthCheckRating): string => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return 'green';
    case HealthCheckRating.LowRisk:
      return 'gold';
    case HealthCheckRating.HighRisk:
      return 'orange';
    case HealthCheckRating.CriticalRisk:
      return 'red';
    default:
      return assertNever(rating);
  }
};

const entryBox = {
  border: '1px solid #999',
  borderRadius: 1,
  padding: 1.5,
  marginBottom: 1,
};

const Codes = ({ codes, diagnoses }: { codes?: string[]; diagnoses: Diagnosis[] }) => {
  if (!codes || codes.length === 0) return null;
  return (
    <ul>
      {codes.map(code => (
        <li key={code}>
          {code} {diagnoses.find(d => d.code === code)?.name}
        </li>
      ))}
    </ul>
  );
};

const HospitalDetails = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={entryBox}>
    <p>
      {entry.date} <LocalHospitalIcon />
    </p>
    <p><i>{entry.description}</i></p>
    <Codes codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <p>
      discharged {entry.discharge.date}: {entry.discharge.criteria}
    </p>
    <p>diagnose by {entry.specialist}</p>
  </Box>
);

const OccupationalHealthcareDetails = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={entryBox}>
    <p>
      {entry.date} <WorkIcon /> <i>{entry.employerName}</i>
    </p>
    <p><i>{entry.description}</i></p>
    <Codes codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    {entry.sickLeave && (
      <p>
        sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
      </p>
    )}
    <p>diagnose by {entry.specialist}</p>
  </Box>
);

const HealthCheckDetails = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={entryBox}>
    <p>
      {entry.date} <MedicalServicesIcon />
    </p>
    <p><i>{entry.description}</i></p>
    <FavoriteIcon sx={{ color: ratingColor(entry.healthCheckRating) }} />
    <Codes codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <p>diagnose by {entry.specialist}</p>
  </Box>
);

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalDetails entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareDetails entry={entry} diagnoses={diagnoses} />;
    case 'HealthCheck':
      return <HealthCheckDetails entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
