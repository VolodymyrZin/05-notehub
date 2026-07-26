import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { FormikHelpers } from 'formik';
import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import type { Note } from '../../types/note';

interface NewNote {
  title: string;
  content: string;
  tag: string;
}
interface NoteFormProps {
  onCancel: () => void;
  note?: Note | null;
}
export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
      console.log('Note added successfully');
    },
    onError: error => {
      console.error('Failed to create note:', error);
    },
  });
  const NoteSchema = Yup.object().shape({
    title: Yup.string().max(50).min(3).required(),
    content: Yup.string().max(500).optional(),
    tag: Yup.string()
      .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
      .required(),
  });

  const initialValues: NewNote = {
    title: '',
    content: '',
    tag: 'Todo',
  };

  const handleSubmit = (values: NewNote, actions: FormikHelpers<NewNote>) => {
    mutation.mutate(values, {
      onSuccess: () => actions.resetForm(),
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
