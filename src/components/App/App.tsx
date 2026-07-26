import { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';
import {
  createNote,
  deleteNote,
  fetchNotes,
  type NewNote,
} from '../../services/noteService';
import Loader from '../Louder/Louder';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Pagination from '../Pagination/Pagination';

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, search }),
    placeholderData: keepPreviousData,
  });
  const handleCreateNote = () => {
    setIsModalOpen(true);
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
      console.log('Note added successfully');
    },
    onError: error => {
      console.error('Failed to create note:', error);
    },
  });
  const handleSubmitNote = (newNote: NewNote) => {
    mutation.mutate(newNote);
  };
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      console.log('Note deleted successfully');
    },
    onError: error => {
      console.error('Failed to delete note:', error);
    },
  });
  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };
  const totalPages = data?.totalPages || 0;
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={nextPage => {
              setPage(nextPage);
            }}
          />
        )}
        {
          <button className={css.button} onClick={handleCreateNote}>
            Create note +
          </button>
        }
      </header>
      {data && <NoteList notes={data.notes} onDelete={handleDeleteNote} />}
      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <NoteForm
            onSubmit={handleSubmitNote}
            onCancel={() => {
              setIsModalOpen(false);
            }}
          />
        </Modal>
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
    </div>
  );
}
