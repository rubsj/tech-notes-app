import { OutputData } from '@editorjs/editorjs';
import { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ReactTags, Tag } from 'react-tag-autocomplete';
import { TextEditor } from '../components/editor/text-editor';
import { AddEditNoteProps, Notetag } from './types';
import { Guid } from 'guid-typescript';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';

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
  //{question = '', solution = {}, tag = {}} : AddEditNoteProps
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await axios.get('/api/tags');
      console.log('tags response ', response);
      return response.data;
    }
  });
  const [selectedTag, setSelectedTag] = useState<Notetag[]>([]);
  const [editorData, setEditorData] = useState<OutputData>();
  const {
    handleSubmit,
    formState: { errors, isSubmitted, isDirty },
    setValue,
    setError,
    clearErrors,
    trigger,
    control
  } = useForm<AddEditNoteProps>();

  const onAdd = useCallback(
    (newTag: Tag) => {
      console.log('new tag ', newTag);
      setSelectedTag([
        ...selectedTag,
        { ...newTag, id: Guid.create().toString() }
      ]);
    },
    [selectedTag]
  );

  const onDelete = useCallback(
    (index: number) => {
      setSelectedTag(selectedTag.filter((_, i) => i !== index));
    },
    [selectedTag]
  );

  useEffect(() => {
    setValue('tag', selectedTag);
    if (isDirty) {
      trigger('tag');
    }
  }, [selectedTag]);

  useEffect(() => {
    if (isSubmitted && !editorData) {
      setError('solution', { type: 'required' });
    }
  }, [isSubmitted]);

  useEffect(() => {
    if (!isDirty || !isSubmitted) {
      return;
    }
    if (!editorData) {
      setError('solution', { type: 'required' });
      return;
    }
    setValue('solution', editorData);
    if (editorData?.blocks?.length === 0) {
      setError('solution', { type: 'required' });
    } else {
      clearErrors('solution');
    }
  }, [editorData]);

  const onSubmit = handleSubmit(
    (data) => {
      console.log('submit received data ', data);
    },
    (error) => {
      console.error('errors?.question?.message ', errors?.question?.message);
      console.error('submit received error ', error);
    }
  );

  if (isPending) {
    return <Spinner animation='border' variant='primary' />;
  }
  if (isError) {
    return <p className='text-danger'>{error?.message}</p>;
  }

  return (
    <div>
      <form>
        <Form.Group className='mb-1' controlId='topic'>
          <Form.Label>Topic / Question</Form.Label>
          <Controller
            control={control}
            name='question'
            rules={{
              required: 'Question is a required field'
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Form.Control
                as='textarea'
                rows={3}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                ref={ref}
                className={`${errors?.question ? 'is-invalid' : ''}`}
              />
            )}
          />
          <Form.Control.Feedback type='invalid'>
            {errors?.question?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className='mb-1' controlId='tag'>
          <Form.Label>Tags</Form.Label>

          <Controller
            control={control}
            name='tag'
            rules={{
              required: 'Tags is a required field'
            }}
            render={({ field: { onChange, onBlur, ref, value } }) => (
              <ReactTags
                id='tag'
                allowNew
                allowBackspace
                collapseOnSelect
                classNames={{ ...classNames, root: ' react-tags form-control' }}
                suggestions={data}
                onAdd={onAdd}
                onDelete={onDelete}
                selected={value}
                onBlur={onBlur}
                onInput={onChange}
                ref={ref}
                isInvalid={errors?.tag ? true : false}
              />
            )}
          />
          <Form.Control.Feedback type='invalid'>
            {errors?.tag?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className='mb-1' controlId='solution'>
          <Form.Label>Solution Editor</Form.Label>
          <div
            className={`form-control ${errors?.solution ? ' is-invalid' : ''}`}
            id='solution'
          >
            <TextEditor
              data={editorData}
              onChange={setEditorData}
              editorblock='editorjs-container'
            />
          </div>
          <Form.Control.Feedback type='invalid'>
            {'Solution is required field'}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant='primary'
          type='button'
          className='mt-2'
          onClick={onSubmit}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};
