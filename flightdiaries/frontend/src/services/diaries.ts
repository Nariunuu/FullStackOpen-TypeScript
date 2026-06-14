import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const { data } = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return data;
};

export const create = async (entry: NewDiaryEntry): Promise<DiaryEntry> => {
  const { data } = await axios.post<DiaryEntry>(baseUrl, entry);
  return data;
};
