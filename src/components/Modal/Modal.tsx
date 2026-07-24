import React from 'react';
import css from './Modal.module.css';
export interface ModalProps{
  children: React.ReactNode; 
  onClose: () => void;
}

export default function Modal({children, onClose}: ModalProps) {
  return (
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={css.modal} onClick={(event)=>{event.stopPropagation()}}>{children}</div>
    </div>
  );
}
