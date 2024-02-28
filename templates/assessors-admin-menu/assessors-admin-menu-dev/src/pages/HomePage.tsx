import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteAssessor as _deleteAssessor, fetchAssessors } from '../api';
import { Button, Table } from '../components';
import { useLoadingScreen } from '../hooks';
import { Assessment } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    isLoading: assessorsLoading,
    error: assessorsError,
    data: assessments,
  } = useQuery(['assessors'], fetchAssessors);

  const {
    isLoading: deleteAssessorLoading,
    error: deleteAssessorError,
    mutate: deleteAssessor,
  } = useMutation(_deleteAssessor, {
    onSuccess: () => queryClient.invalidateQueries(['assessors']),
  });

  useLoadingScreen(
    assessorsLoading || deleteAssessorLoading,
    assessorsError || deleteAssessorError
  );

  if (!assessments) return null;

  return (
    <main>
      <h1 className="mb-6 text-4xl">Assessors</h1>
      <Table
        className="mb-4"
        data={assessments}
        columns={['ID', 'Assessor']}
        renderRow={(assessment: Assessment, i) => [i + 1, assessment.name]}
        itemName="assessor"
        onParametersClick={(assessment: Assessment) =>
          navigate(`/${assessment.id}`, { state: { assessment: assessment } })
        }
        onDelete={(assessment: Assessment) => deleteAssessor(assessment.id)}
      />
      <Button look="blue" onClick={() => navigate(`/new`)}>
        Add New Assessor
      </Button>
    </main>
  );
};

export default HomePage;
