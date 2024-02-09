import { OutputData } from '@editorjs/editorjs';
import { useCallback, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { ReactTags } from 'react-tag-autocomplete';
import { TextEditor } from '../components/editor/text-editor';
import { Notetag } from './types';

export type CreateNoteProps = {
  question: string;
  solution: OutputData;
  tag: string[];
};

const defaultTags: Notetag[] = [
  { value: 'java', label: 'Java', id: '1'},
  { value: 'react', label: 'React', id: '2' }
];

const classNames = {
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

export const AddEditNote = () => {
  const [selectedTag, setSelectedTag] = useState<Notetag[]>([]);
  const [editorData, setEditorData] = useState<OutputData>();

  const onAdd = useCallback(
    (newTag: Notetag) => {
      console.log('new tag ', newTag);
      setSelectedTag([...selectedTag, newTag]);
    },
    [selectedTag]
  );

  const onDelete = useCallback(
    (index: number) => {
      setSelectedTag(selectedTag.filter((_, i) => i !== index));
    },
    [selectedTag]
  );

  return (
    <div>
      <form>
        <Form.Group className='mb-1' controlId='topic'>
          <Form.Label>Topic / Question</Form.Label>
          <Form.Control as='textarea' rows={3} />
        </Form.Group>
        <Form.Group className='mb-1' controlId='tag'>
          <Form.Label>Tags</Form.Label>
          <ReactTags
            id='tag'
            allowNew
            allowBackspace
            collapseOnSelect
            classNames={{ ...classNames, root: ' react-tags form-control' }}
            suggestions={defaultTags}
            onAdd={onAdd}
            onDelete={onDelete}
            selected={selectedTag}
          />
        </Form.Group>
        <Form.Group className='mb-1' controlId='solution'>
          <Form.Label>Solution Editor</Form.Label>
          <div className='form-control'>
              <TextEditor
                data={editorData}
                onChange={setEditorData}
                editorblock='editorjs-container'
              />
            </div>
          </Form.Group>
      </form>
    </div>
  );
};
