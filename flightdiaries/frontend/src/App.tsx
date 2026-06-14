import { useEffect, useState } from 'react';
import AddDiaryForm from './AddDiaryForm';
import { getAll } from './services/diaries';
import type { NonSensitiveDiaryEntry } from './types';

const DiaryList = ({ diaries }: { diaries: NonSensitiveDiaryEntry[] }) => (
  <>
    {diaries.map(diary => (
      <div key={diary.id}>
        <h3>{diary.date}</h3>
        <p>visibility: {diary.visibility}</p>
        <p>weather: {diary.weather}</p>
      </div>
    ))}
  </>
);

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    getAll().then(setDiaries);
  }, []);

  return (
    <div>
      <AddDiaryForm onAdded={entry => setDiaries(diaries.concat(entry))} />
      <h1>Diary entries</h1>
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;
