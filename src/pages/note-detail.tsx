import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Breadcrumb, Button, Card, Nav, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { EditorDisplay } from '../components/editor/editor-display';
import { useBreadCrumbs } from '../services/bread-crumb';
import { NoteData } from './types';

export const NoteDetail = () => {
  const location = useLocation();
  const breadCrumbs = useBreadCrumbs();
  const navigate = useNavigate();
  const [noteId, setNoteId] = useState<string>('');
  const [loadEditor, setLoadEditor] = useState<boolean>(false);
  const { isPending, isError, data, error } = useQuery({
    queryKey: [noteId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/notes/${noteId}`);
      console.log('note details data ', data);
      return data as NoteData;
    }
  });

  useEffect(() => {
    const paths = location?.pathname.split('/');
    console.log('noted details  ', paths?.[paths.length - 1]);
    setNoteId(paths?.[paths.length - 1]);
    console.log('data ', data);
    setLoadEditor(true);
  }, [data, location]);

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
    <>
      <Breadcrumb>
        {breadCrumbs?.map((crumb, index) => {
          const label =
            breadCrumbs.length - 1 === index ? 'Note Detail' : crumb.label;
          return (
            <Breadcrumb.Item
              key={crumb.link}
              linkAs={Link}
              linkProps={{ to: `${crumb.link}` }}
              active={breadCrumbs.length - 1 === index}
            >
              {label}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <Card>
        <Card.Body>
          <Card.Title>{data?.question}</Card.Title>
          <Nav
            variant='pills'
            className='d-flex flex-row justify-content-center'
          >
            {data?.tag?.map((tag) => (
              <Nav.Item key={tag.id} className='ms-3'>
                <Button variant='success' disabled>
                  {tag.label}
                </Button>
              </Nav.Item>
            ))}
            <Nav.Item key={'button'} className='ms-3'>
              <Button
                variant='primary'
                onClick={() =>
                  navigate('/add-edit-note', { state: { ...data } })
                }
              >
                Edit Note
              </Button>
            </Nav.Item>
          </Nav>
          {loadEditor && (
            <EditorDisplay
              editorblock={'solution-display'}
              data={data?.solution}
            />
          )}
        </Card.Body>
      </Card>
    </>
  );
};
