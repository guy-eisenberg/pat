import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteActivity as _deleteActivity, fetchActivities } from '../api';
import { Button, Table } from '../components';
import { useLoadingScreen } from '../hooks';
import { Activity } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    isLoading: activitiesLoading,
    error: activitiesError,
    data: activities,
  } = useQuery(['activities'], fetchActivities);

  const {
    isLoading: deleteActivityLoading,
    error: deleteActivityError,
    mutate: deleteActivity,
  } = useMutation(_deleteActivity, {
    onSuccess: () => queryClient.invalidateQueries(['activities']),
  });

  useLoadingScreen(
    activitiesLoading || deleteActivityLoading,
    activitiesError || deleteActivityError
  );

  if (!activities) return null;

  return (
    <main>
      <h1 className="mb-6 text-4xl">Activities</h1>
      <Table
        className="mb-4"
        data={activities}
        columns={['ID', 'Activity', 'Slug', 'Hyperlink']}
        renderRow={(activity: Activity, i) => [
          i + 1,
          activity.name,
          activity.slug,
          <a className="underline" href={activity.run_hyperlink}>
            {activity.run_hyperlink}
          </a>,
        ]}
        itemName="activity"
        onParametersClick={(activity: Activity) => navigate(`/${activity.id}`)}
        onDelete={(activity: Activity) => deleteActivity(activity.id)}
      />
      <Button look="blue" onClick={() => navigate(`/new`)}>
        Add New Activity
      </Button>
    </main>
  );
};

export default HomePage;
