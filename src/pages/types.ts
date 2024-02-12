import { OutputData } from '@editorjs/editorjs';
import type { Tag } from 'react-tag-autocomplete';

export type Notetag = Tag & {id: string};

export type AddEditNoteProps = {
    question: string;
    solution: OutputData;
    tag: Notetag[];
  };