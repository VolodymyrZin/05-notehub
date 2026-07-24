import React from 'react';
import css from './SearchBox.module.css';

export default function SearchBox() {
  return <input className={css.input} type="text" placeholder="Search notes" />;
}
