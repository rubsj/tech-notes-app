import axios from 'axios';

import { NoteData, SearchResults } from '../pages/types';

export const searchNotes = async (
  tagIds: string[]
): Promise<SearchResults[]> => {
  const { data: notes } = await axios.get('/api/notes');
  console.log('received notes ', notes);
  const notesForTags = notes.filter(
    (note: NoteData) =>
      note.tag.map((tag) => tag.id).filter((id) => tagIds.includes(id)).length >
      0
  );
  console.log('notesForTags ', notesForTags);
  const searchedQuestions: SearchResults[] = notesForTags.map(
    (note: NoteData) => ({
      id: note.id,
      question: note.question
    })
  );
  return searchedQuestions;
};
