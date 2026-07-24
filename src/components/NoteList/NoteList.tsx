import React from 'react';
import css from './NoteList.module.css';
import type { Note } from '../../types/note';
export interface NoteListProps {
  notes: Note[];
  onDelete: (id:string)=>void
}
export default function NoteList({ notes, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return <p>No notes found</p>;
  }
  return (
    <ul className={css.list}>
      {notes.map((note: Note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.button} onClick={()=>onDelete(note.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
