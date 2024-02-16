import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, Breadcrumb, Card, ListGroup, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useBreadCrumbs } from '../services/bread-crumb';
import { searchNotes } from '../services/search-notes';
import { Notetag } from './types';

export const ListNotes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTags] = useState<Notetag[]>(
    location?.state ? [location?.state] : []
  );

  const breadCrumbs = useBreadCrumbs();

  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['notes', searchTags],
    queryFn: async () => {
      const data = await searchNotes(searchTags?.map((tag) => tag?.id));
      return data;
    }
  });

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
      <Card className='mb-3'>
        <Card.Header as='h5'>Search Filter</Card.Header>
        <Card.Body>TBD</Card.Body>
      </Card>
      {isPending && <Spinner animation='border' variant='primary' />}
      {isError && (
        <Alert variant='danger' dismissible>
          {`Note: ${error?.message}` ?? 'Note Detail Failed'}
        </Alert>
      )}
      {isSuccess && (
        <ListGroup>
          <ListGroup.Item variant='primary'>Search Result</ListGroup.Item>
          {data.length === 0 && (
            <ListGroup.Item>{'No question found!'}</ListGroup.Item>
          )}
          {data.length !== 0 &&
            data?.map((item) => (
              <ListGroup.Item
                action
                key={item.id}
                onClick={() => navigate(`${location.pathname}/${item.id}`)}
              >
                {item.question}
              </ListGroup.Item>
            ))}
        </ListGroup>
      )}
    </>
  );
};
