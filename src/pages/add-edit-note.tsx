import { OutputData } from '@editorjs/editorjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Guid } from 'guid-typescript';
import { useEffect, useState } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { ReactTags, Tag } from 'react-tag-autocomplete';

import { TextEditor } from '../components/editor/text-editor';
import { useBreadCrumbs } from '../services/bread-crumb';
import { AddEditNoteForm, NoteData, Notetag, tagsClassNames } from './types';

export const AddEditNote = () => {
  const breadCrumbs = useBreadCrumbs();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [selectedTag, setSelectedTag] = useState<Notetag[]>([]);
  const [editorData, setEditorData] = useState<OutputData>();
  const [newTagsToAdd, setNewTagsToAdd] = useState<Notetag[]>([]);
  const [pageDTO, setPageDTO] = useState<NoteData | undefined>();
  const [loadEditor, setLoadEditor] = useState<boolean>(false);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await axios.get('/api/tags');
      return response.data;
    }
  });

  const addNotesMutation = useMutation({
    mutationFn: (newNote: AddEditNoteForm) => {
      const note = { id: Guid.create().toString(), ...newNote };
      if (pageDTO?.id) {
        return axios.put(`/api/notes/${pageDTO.id}`, { ...note });
      }
      return axios.post('/api/notes', { ...note });
    },
    onSettled: () => {
      queryClient.clear();
    }
  });

  const addTagMutation = useMutation({
    mutationFn: (tag: Notetag) => {
      return axios.post('/api/tags', { ...tag });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tags'] })
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitted, isDirty },
    setValue,
    setError,
    clearErrors,
    trigger,
    control
  } = useForm<AddEditNoteForm>();

  useEffect(() => {
    if (!location?.state) {
      setLoadEditor(true);
      return;
    }
    const note: NoteData = location.state;
    setPageDTO(location.state);
    setValue('tag', note.tag);
    setValue('solution', note.solution);
    setEditorData(note.solution);
    setValue('question', note.question);
    setSelectedTag(note.tag);
    setLoadEditor(true);
  }, [location, setValue]);

  useEffect(() => {
    setValue('tag', selectedTag);
    if (isDirty && isSubmitted) {
      trigger('tag');
    }
  }, [isDirty, isSubmitted, selectedTag, setValue, trigger]);

  useEffect(() => {
    if (editorData) {
      setValue('solution', editorData);
    }
    if (isSubmitted) {
      if (!editorData || editorData.blocks?.length === 0) {
        setError('solution', { type: 'required' });
      } else {
        clearErrors('solution');
      }
    }
  }, [clearErrors, editorData, isDirty, isSubmitted, setError, setValue]);

  const onAdd = (newTag: Tag | Notetag) => {
    if ((newTag as Notetag)?.id) {
      setSelectedTag([...selectedTag, newTag as Notetag]);
    } else {
      const tag = { ...newTag, id: Guid.create().toString() };
      setNewTagsToAdd([...newTagsToAdd, tag]);
      setSelectedTag([...selectedTag, tag]);
    }
  };

  const onDelete = (index: number) => {
    const tagToBeRemoved = selectedTag.filter((_, i) => i === index)?.[0];
    setSelectedTag(selectedTag.filter((tag) => tag.id !== tagToBeRemoved.id));
    setNewTagsToAdd(newTagsToAdd.filter((tag) => tag.id !== tagToBeRemoved.id));
  };

  const onSubmit = handleSubmit(
    async (formData) => {
      const { data: dataDTO } = await addNotesMutation.mutateAsync(formData);
      setPageDTO(dataDTO);

      // create new tags if new tags are to be created
      let remainingTags = newTagsToAdd;
      await Promise.all(
        newTagsToAdd?.map(async (tag) => {
          const { data: dataTagDto } = await addTagMutation.mutateAsync(tag);
          remainingTags = remainingTags.filter(
            (val) => val.id != dataTagDto.id
          );
        })
      );
      setNewTagsToAdd(remainingTags);
    },
    (error) => {
      console.error('submit received error ', error);
    }
  );

  if (isPending) {
    return <Spinner animation='border' variant='primary' />;
  }
  if (isError) {
    return (
      <Alert variant='danger' dismissible>
        {`Note: ${error?.message}` ?? 'Note Detail Failed'}
      </Alert>
    );
  }

  return (
    <div>
      {addNotesMutation?.isError && (
        <Alert variant='danger' dismissible>
          {`Note: ${addNotesMutation?.error?.message}` ?? 'Add Notes Failed'}
        </Alert>
      )}
      {addTagMutation?.isError && (
        <Alert variant='danger' dismissible>
          {`Tag: ${addTagMutation?.error?.message}` ?? 'Add new tag failed'}
        </Alert>
      )}
      <Breadcrumb>
        {breadCrumbs?.map((crumb, index) => (
          <Breadcrumb.Item
            key={crumb.link}
            linkAs={Link}
            linkProps={{ to: `${crumb.link}` }}
            active={breadCrumbs.length - 1 === index}
          >
            {crumb.label}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
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
            {loadEditor && (
              <TextEditor
                data={editorData}
                onChange={setEditorData}
                editorblock='editorjs-container'
              />
            )}
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
