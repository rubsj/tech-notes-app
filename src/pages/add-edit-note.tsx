import { OutputData } from '@editorjs/editorjs';
import { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ReactTags, Tag } from 'react-tag-autocomplete';
import { TextEditor } from '../components/editor/text-editor';
import { AddEditNoteProps, Notetag, tagsClassNames } from './types';
import { Guid } from 'guid-typescript';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';

export const AddEditNote = () => {
  //{question = '', solution = {}, tag = {}} : AddEditNoteProps
  const queryClient = useQueryClient();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await axios.get('/api/tags');
      console.log('tags response ', response.data);
      return response.data;
    }
  });

  const addNotesMutation = useMutation({
    mutationFn: (newNote: AddEditNoteProps) => {
      const note = { id: Guid.create().toString(), ...newNote };
      console.log('adding note to db ', note);
      return axios.post('/api/notes', { ...note });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notes'] })
  });

  const addTagMutation = useMutation({
    mutationFn: (tag: Notetag) => {
      console.log('adding tag to db ', tag);
      return axios.post('/api/tags', { ...tag });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tags'] })
  });

  const [selectedTag, setSelectedTag] = useState<Notetag[]>([]);
  const [editorData, setEditorData] = useState<OutputData>();
  const [newTagsToAdd, setNewTagsToAdd] = useState<Notetag[]>([]);

  const {
    handleSubmit,
    formState: { errors, isSubmitted, isDirty },
    setValue,
    setError,
    clearErrors,
    trigger,
    control
  } = useForm<AddEditNoteProps>();

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
    console.log(editorData);
  }, [editorData]);

  const onAdd = useCallback(
    (newTag: Tag | Notetag) => {
      console.log('new tag ', newTag);
      if ((newTag as any)?.id) {
        console.log('setting existing tag');
        setSelectedTag([...selectedTag, newTag as any]);
      } else {
        console.log('setting new tag');
        const tag = { ...newTag, id: Guid.create().toString() };
        setNewTagsToAdd([...newTagsToAdd, tag]);
        setSelectedTag([...selectedTag, tag]);
      }
    },
    [selectedTag]
  );

  const onDelete = useCallback(
    (index: number) => {
      setSelectedTag(selectedTag.filter((_, i) => i !== index));
    },
    [selectedTag]
  );

  const onSubmit = handleSubmit(
    (data) => {
      console.log('submit received data ', data);
      // create new note
      addNotesMutation.mutate(data);

      // create new tags if new tags are to be created
      newTagsToAdd?.forEach((tag) => {
        addTagMutation.mutate(tag);
      });
    },
    (error) => {
      console.error('errors?.question?.message ', errors);
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
      {addNotesMutation?.isError && (
        <Alert variant='danger' dismissible>
          {addNotesMutation?.error?.message ?? 'Add Notes Failed'}
        </Alert>
      )}
      {addTagMutation?.isError && (
        <Alert variant='danger' dismissible>
          {addTagMutation?.error?.message ?? 'Add new tag failed'}
        </Alert>
      )}
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
            render={({ field: { ref, value } }) => (
              <ReactTags
                id='tag'
                allowNew
                allowBackspace
                collapseOnSelect
                classNames={{
                  ...tagsClassNames,
                  root: ' react-tags form-control'
                }}
                suggestions={data}
                onAdd={onAdd}
                onDelete={onDelete}
                selected={value}
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
          disabled={addNotesMutation.isPending || addTagMutation.isPending}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};
