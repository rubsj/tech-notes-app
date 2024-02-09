import Card from 'react-bootstrap/Card';
import { useNavigate, useRouteError } from 'react-router-dom';

export const ErrorPage = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();
  return (
    <Card>
      <Card.Body>
        <Card.Title>Error Page</Card.Title>
        <Card.Text>Sorry, an unexpected error has occurred.</Card.Text>
        <Card.Text>
          <i className='text-danger'>{error?.statusText || error?.message}</i>
        </Card.Text>
        <Card.Link onClick={() => navigate('/')}>Go Home</Card.Link>
      </Card.Body>
    </Card>
  );
};
