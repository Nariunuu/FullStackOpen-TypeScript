import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

import patientService from '../../services/patients';
import { Gender, type Diagnosis, type Patient } from '../../types';
import EntryDetails from './EntryDetails';
import AddEntryForm from './AddEntryForm';

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
  const [formOpen, setFormOpen] = useState(false);

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

      {formOpen ? (
        <AddEntryForm
          patientId={patient.id}
          diagnoses={diagnoses}
          onAdded={entry => {
            setPatient({
              ...patient,
              entries: [...(patient.entries ?? []), entry],
            });
            setFormOpen(false);
          }}
          onCancel={() => setFormOpen(false)}
        />
      ) : (
        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={() => setFormOpen(true)}
        >
          Add New Entry
        </Button>
      )}

      {patient.entries && patient.entries.length > 0 && (
        <>
          <Typography variant="h6" sx={{ marginTop: 2 }}>entries</Typography>
          {patient.entries.map(entry => (
            <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
          ))}
        </>
      )}
    </div>
  );
};

export default PatientPage;
