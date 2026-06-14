import { useState, type SyntheticEvent } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

import patientService from "../../services/patients";
import type { Entry } from "../../types";

interface Props {
  patientId: string;
  onAdded: (entry: Entry) => void;
}

const formatError = (e: unknown): string => {
  if (axios.isAxiosError(e) && e.response) {
    const data: unknown = e.response.data;
    if (typeof data === "string") return data;
    return JSON.stringify(data);
  }
  return e instanceof Error ? e.message : "Unknown error";
};

const AddEntryForm = ({ patientId, onAdded }: Props) => {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [rating, setRating] = useState("");
  const [codes, setCodes] = useState("");
  const [error, setError] = useState("");

  const reset = () => {
    setDate("");
    setDescription("");
    setSpecialist("");
    setRating("");
    setCodes("");
    setError("");
  };

  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const diagnosisCodes = codes
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const entry = {
      type: "HealthCheck",
      date,
      description,
      specialist,
      healthCheckRating: Number(rating),
      ...(diagnosisCodes.length > 0 ? { diagnosisCodes } : {}),
    };

    try {
      const added = await patientService.addEntry(patientId, entry);
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
      <Typography variant="h6">New HealthCheck Entry</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Date" required fullWidth margin="dense"
        value={date} onChange={e => setDate(e.target.value)} />
      <TextField label="Description" required fullWidth margin="dense"
        value={description} onChange={e => setDescription(e.target.value)} />
      <TextField label="Specialist" required fullWidth margin="dense"
        value={specialist} onChange={e => setSpecialist(e.target.value)} />
      <TextField label="Health Check Rating (0-3)" required fullWidth margin="dense"
        value={rating} onChange={e => setRating(e.target.value)} />
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
