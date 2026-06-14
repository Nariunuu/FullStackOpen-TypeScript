import { useState, type SyntheticEvent } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  type SelectChangeEvent,
} from "@mui/material";

import patientService from "../../services/patients";
import { HealthCheckRating, type Diagnosis, type Entry } from "../../types";

interface Props {
  patientId: string;
  diagnoses: Diagnosis[];
  onAdded: (entry: Entry) => void;
  onCancel: () => void;
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const entryTypeOptions: { value: EntryType; label: string }[] = [
  { value: "HealthCheck", label: "Health Check" },
  { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
  { value: "Hospital", label: "Hospital" },
];

const ratingOptions: { value: HealthCheckRating; label: string }[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low Risk" },
  { value: HealthCheckRating.HighRisk, label: "High Risk" },
  { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" },
];

const isEntryType = (value: string): value is EntryType =>
  entryTypeOptions.some(o => o.value === value);

const isRating = (value: number): value is HealthCheckRating =>
  ratingOptions.some(o => o.value === value);

const formatError = (e: unknown): string => {
  if (axios.isAxiosError(e) && e.response) {
    const data: unknown = e.response.data;
    if (typeof data === "string") return data;
    return JSON.stringify(data);
  }
  return e instanceof Error ? e.message : "Unknown error";
};

const AddEntryForm = ({ patientId, diagnoses, onAdded, onCancel }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const [rating, setRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
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
    setSelectedCodes([]);
    setRating(HealthCheckRating.Healthy);
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickStart("");
    setSickEnd("");
    setError("");
  };

  const onCodesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCodes(typeof value === "string" ? value.split(",") : value);
  };

  const buildEntry = (): unknown => {
    const codesField = selectedCodes.length > 0 ? { diagnosisCodes: selectedCodes } : {};
    const base = { date, description, specialist, ...codesField };

    switch (type) {
      case "HealthCheck":
        return { ...base, type, healthCheckRating: rating };
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

      <TextField
        label="Date" type="date" required fullWidth margin="dense"
        InputLabelProps={{ shrink: true }}
        value={date} onChange={e => setDate(e.target.value)}
      />
      <TextField label="Description" required fullWidth margin="dense"
        value={description} onChange={e => setDescription(e.target.value)} />
      <TextField label="Specialist" required fullWidth margin="dense"
        value={specialist} onChange={e => setSpecialist(e.target.value)} />

      {type === "HealthCheck" && (
        <TextField
          select
          label="Health Check Rating"
          fullWidth
          margin="dense"
          value={rating}
          onChange={e => {
            const n = Number(e.target.value);
            if (isRating(n)) setRating(n);
          }}
        >
          {ratingOptions.map(o => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
      )}

      {type === "Hospital" && (
        <>
          <TextField label="Discharge Date" type="date" required fullWidth margin="dense"
            InputLabelProps={{ shrink: true }}
            value={dischargeDate} onChange={e => setDischargeDate(e.target.value)} />
          <TextField label="Discharge Criteria" required fullWidth margin="dense"
            value={dischargeCriteria} onChange={e => setDischargeCriteria(e.target.value)} />
        </>
      )}

      {type === "OccupationalHealthcare" && (
        <>
          <TextField label="Employer Name" required fullWidth margin="dense"
            value={employerName} onChange={e => setEmployerName(e.target.value)} />
          <TextField label="Sick Leave Start" type="date" fullWidth margin="dense"
            InputLabelProps={{ shrink: true }}
            value={sickStart} onChange={e => setSickStart(e.target.value)} />
          <TextField label="Sick Leave End" type="date" fullWidth margin="dense"
            InputLabelProps={{ shrink: true }}
            value={sickEnd} onChange={e => setSickEnd(e.target.value)} />
        </>
      )}

      <FormControl fullWidth margin="dense">
        <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          multiple
          value={selectedCodes}
          onChange={onCodesChange}
          label="Diagnosis Codes"
        >
          {diagnoses.map(d => (
            <MenuItem key={d.code} value={d.code}>
              {d.code} — {d.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ marginTop: 1, display: "flex", gap: 1 }}>
        <Button type="submit" variant="contained">Add</Button>
        <Button variant="outlined" type="button" onClick={() => { reset(); onCancel(); }}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;
