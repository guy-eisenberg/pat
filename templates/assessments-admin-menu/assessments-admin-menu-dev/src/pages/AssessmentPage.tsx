import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchActivities,
  fetchArticles,
  fetchAssessments,
  postAssessment as _postAssessment,
} from '../api';
import { AutoCompleteInput, Button, Input, LabaledBox } from '../components';
import { useLoadingScreen } from '../hooks';
import { p, reportSuccess, tempId } from '../lib';
import { Activity, Article } from '../types';

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams();

  const queryClient = useQueryClient();

  const {
    isLoading: availableActivitiesLoading,
    error: availableActivitiesError,
    data: availableActivities,
  } = useQuery(['available-activities'], fetchActivities);

  const {
    isLoading: availableArticlesLoading,
    error: availableArticlesError,
    data: availableArticles,
  } = useQuery(['available-articles'], fetchArticles);

  const {
    isLoading: assessmentsLoading,
    error: assessmentsError,
    data: assessments,
  } = useQuery(['assessments'], fetchAssessments);

  const {
    isLoading: postAssessmentLoading,
    error: postAssessmentError,
    mutate: postAssessment,
  } = useMutation(_postAssessment, {
    onSuccess: async (assessmentId) => {
      await queryClient.invalidateQueries(['assessments']);

      reportSuccess('Assessment was successfully saved.');

      navigate(`/${assessmentId}`);
    },
  });

  const onExistingAssessment =
    assessmentId && assessmentId !== 'new' && !isNaN(parseInt(assessmentId));

  const assessment = useMemo(() => {
    return onExistingAssessment && assessments
      ? assessments.find((assessment) => assessment.id === assessmentId)
      : undefined;
  }, [assessmentId, onExistingAssessment, assessments]);

  const [activityQuery, setActivityQuery] = useState('');
  const [articleQuery, setArticleQuery] = useState('');

  const [name, setName] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const activitiesOptions = useMemo(() => {
    if (!availableActivities) return [];

    const activitiesIds = activities.map((activity) => activity.id);

    return availableActivities
      .filter((activity) => !activitiesIds.includes(`${activity.id}`))
      .map((activity) => ({
        id: activity.id,
        label: activity.name,
      }));
  }, [availableActivities, activities]);

  const articlesOptions = useMemo(() => {
    if (!availableArticles) return [];

    const articlesIds = articles.map((article) => article.id);

    console.log(articlesIds);

    return availableArticles
      .filter((article) => !articlesIds.includes(`${article.id}`))
      .map((article) => ({
        id: article.id,
        label: article.title,
      }));
  }, [availableArticles, articles]);

  useEffect(() => {
    if (!assessment) return;

    setName(assessment.name);
    setActivities(assessment.activities);
    setArticles(assessment.articles);
  }, [assessment]);

  useLoadingScreen(
    availableActivitiesLoading ||
      availableArticlesLoading ||
      assessmentsLoading ||
      postAssessmentLoading,
    availableActivitiesError ||
      availableArticlesError ||
      assessmentsError ||
      postAssessmentError
  );

  return (
    <main className="flex flex-col gap-4">
      <h1 className="mb-6 text-4xl">
        {onExistingAssessment ? 'Edit Assessment' : 'Add New Assessment'}
      </h1>
      <LabaledBox className="flex-1" label="Name">
        <Input
          className="w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </LabaledBox>
      <div className="flex items-start gap-4">
        <LabaledBox className="flex-1" label="Related Activities">
          <AutoCompleteInput
            placeholder="Search for an Activity"
            className="w-full"
            value={activityQuery}
            onChange={(e) => setActivityQuery(e.target.value)}
            options={activitiesOptions}
            onOptionSelect={(option) => {
              if (!availableActivities) return;

              const newActivities = [...activities];

              const activity = availableActivities.find(
                (activity) => activity.id === option.id
              );

              if (!activity) return;

              activity.id = `${activity.id}`;

              newActivities.push(activity);

              setActivities(newActivities);
              setActivityQuery('');
            }}
          />
          {activities.length > 0 && (
            <ul className="mt-4 flex w-full flex-col gap-2">
              {activities.map((activity, i) => (
                <li
                  className="flex items-center gap-4 overflow-hidden rounded-md border border-theme-light-gray bg-white"
                  key={activity.id}
                >
                  <img
                    alt="activity thumbnail"
                    className="h-12 w-12"
                    src={activity.image}
                  />
                  <span className="font-medium text-theme-extra-dark-gray">
                    {activity.name}
                  </span>
                  <span className="text-theme-light-gray">
                    [{activity.slug}]
                  </span>
                  <button
                    className="ml-auto mr-2 hover:brightness-75"
                    onClick={() => {
                      const newActivities = [...activities];

                      newActivities.splice(i, 1);

                      setActivities(newActivities);
                    }}
                  >
                    <img
                      alt="delete icon"
                      className="w-6"
                      src={p('icons/delete_icon.svg')}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </LabaledBox>
        <LabaledBox className="flex-1" label="Related Articles">
          <AutoCompleteInput
            placeholder="Search for an Article"
            className="w-full"
            value={articleQuery}
            onChange={(e) => setArticleQuery(e.target.value)}
            options={articlesOptions}
            onOptionSelect={(option) => {
              if (!availableArticles) return;

              const newArticles = [...articles];

              const article = availableArticles.find(
                (article) => article.id === option.id
              );

              if (!article) return;

              article.id = `${article.id}`;

              newArticles.push(article);

              setArticles(newArticles);
              setArticleQuery('');
            }}
          />
          {articles.length > 0 && (
            <ul className="mt-4 flex w-full flex-col gap-2">
              {articles.map((article, i) => (
                <li
                  className="flex h-12 items-center gap-4 overflow-hidden rounded-md border border-theme-light-gray bg-white px-2"
                  key={article.id}
                >
                  <span className="font-medium text-theme-extra-dark-gray">
                    {article.title}
                  </span>
                  <button
                    className="ml-auto hover:brightness-75"
                    onClick={() => {
                      const newArticles = [...articles];

                      newArticles.splice(i, 1);

                      setArticles(newArticles);
                    }}
                  >
                    <img
                      alt="delete icon"
                      className="w-6"
                      src={p('icons/delete_icon.svg')}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </LabaledBox>
      </div>
      <div className="flex gap-4 self-end">
        <Button look="gray" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button
          look="green"
          disabled={name.length === 0}
          onClick={() => {
            postAssessment({
              id: onExistingAssessment ? assessmentId : tempId(),
              name,
              activities,
              articles,
            });
          }}
        >
          Save Assessment
        </Button>
      </div>
    </main>
  );
};

export default AssessmentPage;
