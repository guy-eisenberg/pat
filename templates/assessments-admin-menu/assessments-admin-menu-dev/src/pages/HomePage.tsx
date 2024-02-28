import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  deleteAssessment as _deleteAssessment,
  fetchAssessments,
} from '../api';
import { Button, Table } from '../components';
import { useLoadingScreen } from '../hooks';
import { Assessment } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    isLoading: assessmentsLoading,
    error: assessmentsError,
    data: assessments,
  } = useQuery(['assessments'], fetchAssessments);

  const {
    isLoading: deleteAssessmentLoading,
    error: deleteAssessmentError,
    mutate: deleteAssessment,
  } = useMutation(_deleteAssessment, {
    onSuccess: () => queryClient.invalidateQueries(['assessments']),
  });

  useLoadingScreen(
    assessmentsLoading || deleteAssessmentLoading,
    assessmentsError || deleteAssessmentError
  );

  if (!assessments) return null;

  return (
    <main>
      <h1 className="mb-6 text-4xl">Assessments</h1>
      <Table
        className="mb-4"
        data={assessments}
        columns={['ID', 'Assessment']}
        renderRow={(assessment: Assessment, i) => [i + 1, assessment.name]}
        itemName="assessment"
        onParametersClick={(assessment: Assessment) =>
          navigate(`/${assessment.id}`, { state: { assessment: assessment } })
        }
        onDelete={(assessment: Assessment) => deleteAssessment(assessment.id)}
      />
      <Button look="blue" onClick={() => navigate(`/new`)}>
        Add New Assessment
      </Button>
    </main>
  );
};

export default HomePage;
