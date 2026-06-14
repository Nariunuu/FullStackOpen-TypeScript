import { useState, type SyntheticEvent } from 'react';
import { create } from './services/diaries';
import { Visibility, Weather } from './types';
import type { DiaryEntry } from './types';

const isWeather = (value: string): value is Weather =>
  Object.values(Weather).some(w => w === value);

const isVisibility = (value: string): value is Visibility =>
  Object.values(Visibility).some(v => v === value);

const AddDiaryForm = ({ onAdded }: { onAdded: (entry: DiaryEntry) => void }) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [comment, setComment] = useState('');

  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const added = await create({ date, weather, visibility, comment });
    onAdded(added);
    setDate('');
    setComment('');
  };

  return (
    <form onSubmit={submit}>
      <h2>Add new entry</h2>
      <div>
        date <input value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div>
        visibility{' '}
        <select
          value={visibility}
          onChange={e => isVisibility(e.target.value) && setVisibility(e.target.value)}
        >
          {Object.values(Visibility).map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
      <div>
        weather{' '}
        <select
          value={weather}
          onChange={e => isWeather(e.target.value) && setWeather(e.target.value)}
        >
          {Object.values(Weather).map(w => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>
      <div>
        comment <input value={comment} onChange={e => setComment(e.target.value)} />
      </div>
      <button type="submit">add</button>
    </form>
  );
};

export default AddDiaryForm;
