import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

import patientService from '../../services/patients';
import { Gender, type Diagnosis, type Entry, type Patient } from '../../types';

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon />;
    case Gender.Female:
      return <FemaleIcon />;
    default:
      return <TransgenderIcon />;
  }
};

const PatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!id) return;
    patientService.getById(id).then(setPatient);
  }, [id]);

  if (!patient) return <p>Loading...</p>;

  return (
    <div>
      <Typography variant="h4" sx={{ marginTop: 2 }}>
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <p>date of birth: {patient.dateOfBirth}</p>

      {patient.entries && patient.entries.length > 0 && (
        <>
          <Typography variant="h6" sx={{ marginTop: 2 }}>entries</Typography>
          {patient.entries.map(entry => (
            <EntryItem key={entry.id} entry={entry} diagnoses={diagnoses} />
          ))}
        </>
      )}
    </div>
  );
};

const EntryItem = ({ entry, diagnoses }: { entry: Entry; diagnoses: Diagnosis[] }) => {
  const findName = (code: string) =>
    diagnoses.find(d => d.code === code)?.name;

  return (
    <div>
      <p>
        {entry.date} <i>{entry.description}</i>
      </p>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map(code => (
            <li key={code}>{code} {findName(code)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientPage;
