import type { Note } from '../types/note';
import axios from 'axios';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface NewNote {
  title: string;
  content: string;
  tag: string;
}
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}
axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] =
  `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`;

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await axios.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, search: search || undefined },
  });  
  return data;
}

//  : має виконувати запит для отримання колекції нотаток із сервера. Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук);
export async function createNote({
  title,
  content,
  tag,
}: NewNote): Promise<Note> {
  const { data } = await axios.post<Note>('/notes', { title, content, tag });
  return data;
}
// : має виконувати запит для створення нової нотатки на сервері. Приймає вміст нової нотатки та повертає створену нотатку у відповіді;
export async function deleteNote(id: string): Promise<Note> {
  const { data } = await axios.delete<Note>(`/notes/${id}`);
  return data;
}
// : має виконувати запит для видалення нотатки за заданим ідентифікатором. Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.
