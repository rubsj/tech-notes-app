import { OutputData } from '@editorjs/editorjs';
import type { Tag } from 'react-tag-autocomplete';

export type Notetag = Tag & { id: string };

export type AddEditNoteForm = {
  question: string;
  solution: OutputData;
  tag: Notetag[];
};

export type NoteData = AddEditNoteForm & { id: string };

export type SearchResults = {
  id: string;
  question: string;
};

export type BreadCrumb = {
  link: string;
  label: string;
};

export const tagsClassNames = {
  root: 'react-tags',
  rootIsActive: 'is-active',
  rootIsDisabled: 'is-disabled',
  rootIsInvalid: 'is-invalid',
  label: 'react-tags__label',
  tagList: 'react-tags__list',
  tagListItem: 'react-tags__list-item',
  tag: 'react-tags__tag',
  tagName: 'react-tags__tag-name',
  comboBox: 'react-tags__combobox',
  input: 'react-tags__combobox-input',
  listBox: 'react-tags__listbox',
  option: 'react-tags__listbox-option',
  optionIsActive: 'is-active',
  highlight: 'react-tags__listbox-option-highlight'
};
