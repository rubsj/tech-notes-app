import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();
  // show add note button
  // show available tags to go to the filter page
  return (
    <Card>
      <Card.Header>My Technical Notes base</Card.Header>
      <Card.Body>
        <Card.Text>This is the base of all notes!</Card.Text>
        <Card.Text>Create a note today and learn something new </Card.Text>
        <Button onClick={() => navigate('add-edit-note')}>Create Note</Button>
        <Card.Text>Click any of the tags below to list all the notes for the tag</Card.Text>
      </Card.Body>
    </Card>
  );
};
