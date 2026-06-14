import { useState, type SyntheticEvent } from 'react';
import axios from 'axios';
import { create } from './services/diaries';
import { Visibility, Weather } from './types';
import type { DiaryEntry } from './types';

const isWeather = (value: string): value is Weather =>
  Object.values(Weather).some(w => w === value);

const isVisibility = (value: string): value is Visibility =>
  Object.values(Visibility).some(v => v === value);

const formatIssue = (issue: unknown): string => {
  if (issue && typeof issue === 'object' && 'message' in issue && typeof issue.message === 'string') {
    const path = 'path' in issue && Array.isArray(issue.path) ? issue.path.join('.') : '';
    return path ? `${path}: ${issue.message}` : issue.message;
  }
  return JSON.stringify(issue);
};

const formatError = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data: unknown = error.response.data;
    if (data && typeof data === 'object' && 'error' in data && Array.isArray(data.error)) {
      return data.error.map(formatIssue).join('; ');
    }
    return JSON.stringify(data);
  }
  return error instanceof Error ? error.message : 'Unknown error';
};

const AddDiaryForm = ({ onAdded }: { onAdded: (entry: DiaryEntry) => void }) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const added = await create({ date, weather, visibility, comment });
      onAdded(added);
      setDate('');
      setComment('');
      setError('');
    } catch (e: unknown) {
      setError(formatError(e));
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Add new entry</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        date <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div>
        visibility{' '}
        {Object.values(Visibility).map(v => (
          <label key={v}>
            {v}{' '}
            <input
              type="radio"
              name="visibility"
              checked={visibility === v}
              onChange={() => isVisibility(v) && setVisibility(v)}
            />
          </label>
        ))}
      </div>
      <div>
        weather{' '}
        {Object.values(Weather).map(w => (
          <label key={w}>
            {w}{' '}
            <input
              type="radio"
              name="weather"
              checked={weather === w}
              onChange={() => isWeather(w) && setWeather(w)}
            />
          </label>
        ))}
      </div>
      <div>
        comment <input value={comment} onChange={e => setComment(e.target.value)} />
      </div>
      <button type="submit">add</button>
    </form>
  );
};

export default AddDiaryForm;
