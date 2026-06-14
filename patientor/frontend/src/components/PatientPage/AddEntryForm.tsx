import { useState, type SyntheticEvent } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";

import patientService from "../../services/patients";
import type { Entry } from "../../types";

interface Props {
  patientId: string;
  onAdded: (entry: Entry) => void;
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const entryTypeOptions: { value: EntryType; label: string }[] = [
  { value: "HealthCheck", label: "Health Check" },
  { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
  { value: "Hospital", label: "Hospital" },
];

const isEntryType = (value: string): value is EntryType =>
  entryTypeOptions.some(o => o.value === value);

const formatError = (e: unknown): string => {
  if (axios.isAxiosError(e) && e.response) {
    const data: unknown = e.response.data;
    if (typeof data === "string") return data;
    return JSON.stringify(data);
  }
  return e instanceof Error ? e.message : "Unknown error";
};

const AddEntryForm = ({ patientId, onAdded }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [codes, setCodes] = useState("");

  const [rating, setRating] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickStart, setSickStart] = useState("");
  const [sickEnd, setSickEnd] = useState("");

  const [error, setError] = useState("");

  const reset = () => {
    setDate("");
    setDescription("");
    setSpecialist("");
    setCodes("");
    setRating("");
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickStart("");
    setSickEnd("");
    setError("");
  };

  const buildEntry = (): unknown => {
    const diagnosisCodes = codes
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0);
    const codesField = diagnosisCodes.length > 0 ? { diagnosisCodes } : {};
    const base = { date, description, specialist, ...codesField };

    switch (type) {
      case "HealthCheck":
        return { ...base, type, healthCheckRating: Number(rating) };
      case "Hospital":
        return {
          ...base,
          type,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
      case "OccupationalHealthcare":
        return {
          ...base,
          type,
          employerName,
          ...(sickStart || sickEnd
            ? { sickLeave: { startDate: sickStart, endDate: sickEnd } }
            : {}),
        };
    }
  };

  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const added = await patientService.addEntry(patientId, buildEntry());
      onAdded(added);
      reset();
    } catch (e: unknown) {
      setError(formatError(e));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{
        border: "1px dashed #888",
        borderRadius: 1,
        padding: 2,
        marginTop: 2,
      }}
    >
      <Typography variant="h6">New Entry</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        select
        label="Entry type"
        fullWidth
        margin="dense"
        value={type}
        onChange={e => isEntryType(e.target.value) && setType(e.target.value)}
      >
        {entryTypeOptions.map(o => (
          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
        ))}
      </TextField>

      <TextField label="Date" required fullWidth margin="dense"
        value={date} onChange={e => setDate(e.target.value)} />
      <TextField label="Description" required fullWidth margin="dense"
        value={description} onChange={e => setDescription(e.target.value)} />
      <TextField label="Specialist" required fullWidth margin="dense"
        value={specialist} onChange={e => setSpecialist(e.target.value)} />

      {type === "HealthCheck" && (
        <TextField label="Health Check Rating (0-3)" required fullWidth margin="dense"
          value={rating} onChange={e => setRating(e.target.value)} />
      )}

      {type === "Hospital" && (
        <>
          <TextField label="Discharge Date" required fullWidth margin="dense"
            value={dischargeDate} onChange={e => setDischargeDate(e.target.value)} />
          <TextField label="Discharge Criteria" required fullWidth margin="dense"
            value={dischargeCriteria} onChange={e => setDischargeCriteria(e.target.value)} />
        </>
      )}

      {type === "OccupationalHealthcare" && (
        <>
          <TextField label="Employer Name" required fullWidth margin="dense"
            value={employerName} onChange={e => setEmployerName(e.target.value)} />
          <TextField label="Sick Leave Start" fullWidth margin="dense"
            value={sickStart} onChange={e => setSickStart(e.target.value)} />
          <TextField label="Sick Leave End" fullWidth margin="dense"
            value={sickEnd} onChange={e => setSickEnd(e.target.value)} />
        </>
      )}

      <TextField label="Diagnosis Codes (comma-separated)" fullWidth margin="dense"
        value={codes} onChange={e => setCodes(e.target.value)} />

      <Box sx={{ marginTop: 1, display: "flex", gap: 1 }}>
        <Button type="submit" variant="contained">add</Button>
        <Button variant="outlined" type="button" onClick={reset}>cancel</Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;
