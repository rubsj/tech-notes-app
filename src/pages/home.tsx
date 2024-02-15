import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Breadcrumb, Button, Card, Nav, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { useBreadCrumbs } from '../services/bread-crumb';
import { Notetag } from './types';

export const Home = () => {
  const navigate = useNavigate();
  const breadCrumbs = useBreadCrumbs();
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await axios.get('/api/tags');
      console.log('tags response ', response);
      return response.data;
    }
  });
  const onPillClick = (id: string, value: string, label: string) => {
    console.log('clicked pill ', label);
    navigate('/list-notes', { state: { id, value, label } });
  };

  return (
    <>
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
      <Card>
        <Card.Header className='bg-info'>My Technical Notes base</Card.Header>
        <Card.Body>
          <Card.Text>This is the base of all notes!</Card.Text>
          <Card.Text>Create a note today and learn something new </Card.Text>
          <Button onClick={() => navigate('add-edit-note')}>Create Note</Button>
          <Card.Text>
            Click any of the tags below to list all the notes for the tag
          </Card.Text>
          {isPending && <Spinner animation='border' variant='primary' />}
          {isError && <p className='text-danger'>{error?.message}</p>}
          {isSuccess && (
            <Nav variant='pills'>
              {data?.map(({ id, value, label }: Notetag) => {
                return (
                  <Nav.Item
                    key={id}
                    id={id}
                    onClick={() => onPillClick(id, value as string, label)}
                  >
                    <Nav.Link>
                      <Button variant='success'>{label}</Button>
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
