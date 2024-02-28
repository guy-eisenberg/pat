import { useNavigate } from 'react-router-dom';
import Button from './Button';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button look="gray" onClick={() => navigate(-1)}>
      Back
    </Button>
  );
};

export default BackButton;
