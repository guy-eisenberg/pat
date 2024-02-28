import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WithContext as ReactTags, Tag } from 'react-tag-input';
import slugify from 'slugify';
import {
  postActivity as _postActivity,
  fetchActivities,
  fetchSkillCategories,
} from '../api';
import { Button, Input, LabaledBox, TextArea } from '../components';
import { useLoadingScreen } from '../hooks';
import { reportSuccess, tempId } from '../lib';
import { Activity, SkillCategory } from '../types';

const ActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const { activityId } = useParams();

  const queryClient = useQueryClient();

  const {
    isLoading: activitiesLoading,
    error: activitiesError,
    data: activities,
  } = useQuery<Activity[]>(['activities'], fetchActivities);

  const {
    isLoading: postActivityLoading,
    error: postActivityError,
    mutate: postActivity,
  } = useMutation<string, unknown, Activity>(_postActivity, {
    onSuccess: async (activityId) => {
      await queryClient.invalidateQueries(['activities']);

      reportSuccess('Activity was successfully saved.');

      navigate(`/${activityId}`);
    },
  });

  const {
    isLoading: skillCategoriesLoading,
    error: skillCategoriesError,
    data: skillCategories,
  } = useQuery<SkillCategory[]>(['skill-categories'], fetchSkillCategories);

  const onExistingActivity =
    activityId && activityId !== 'new' && !isNaN(parseInt(activityId));

  const activity = useMemo(() => {
    return onExistingActivity && activities
      ? activities.find((activity) => activity.id === activityId)
      : undefined;
  }, [activityId, onExistingActivity, activities]);

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [slug, setSlug] = useState('');
  const [pageHyperlink, setPageHyperlink] = useState('');
  const [runHyperlink, setRunHyperlink] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const [selectedSkillCategories, setSelectedSkillCategories] = useState<Tag[]>(
    []
  );

  useEffect(() => {
    if (!activity) return;

    setName(activity.name);
    setShortName(activity.short_name);
    setSlug(activity.slug);
    setPageHyperlink(activity.page_hyperlink);
    setRunHyperlink(activity.run_hyperlink);
    setImage(activity.image || '');
    setDescription(activity.description || '');

    setSelectedSkillCategories(
      activity.skill_categories.map((skillCategory) => ({
        ...skillCategory,
        text: skillCategory.name,
      }))
    );
  }, [activity]);

  useEffect(() => {
    setSlug(slugify(name, { lower: true }));
  }, [name]);

  useLoadingScreen(
    activitiesLoading || postActivityLoading || skillCategoriesLoading,
    activitiesError || postActivityError || skillCategoriesError
  );

  return (
    <main className="flex flex-col gap-4">
      <h1 className="mb-6 text-4xl">
        {onExistingActivity ? 'Edit Activity' : 'Add New Activity'}
      </h1>
      <div className="flex gap-4">
        <LabaledBox className="flex-1" label="Name">
          <Input
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </LabaledBox>
        <LabaledBox className="flex-1" label="Short Name">
          <Input
            className="w-full"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
          />
        </LabaledBox>
        <LabaledBox className="flex-1" label="Slug">
          <Input
            className="w-full"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </LabaledBox>
      </div>
      <div className="flex gap-4">
        <LabaledBox className="flex-1" label="Page Hyperlink">
          <Input
            className="w-full"
            value={pageHyperlink}
            onChange={(e) => setPageHyperlink(e.target.value)}
          />
        </LabaledBox>
        <LabaledBox className="flex-1" label="Run Hyperlink">
          <Input
            className="w-full"
            value={runHyperlink}
            onChange={(e) => setRunHyperlink(e.target.value)}
          />
        </LabaledBox>
      </div>
      <div className="flex items-start gap-4">
        <LabaledBox className="flex-1" label="Skill Categories">
          <ReactTags
            handleAddition={(category) => {
              const categoryValid =
                (skillCategories || [])
                  .map((category) => category.name)
                  .includes(category.text) &&
                !selectedSkillCategories
                  .map((category) => category.text)
                  .includes(category.text);

              if (categoryValid) {
                setSelectedSkillCategories([
                  ...selectedSkillCategories,
                  category,
                ]);
              }
            }}
            handleDelete={(i) => {
              const newSkillCategories = [...selectedSkillCategories];

              newSkillCategories.splice(i, 1);

              setSelectedSkillCategories(newSkillCategories);
            }}
            suggestions={(skillCategories || []).map((category) => ({
              ...category,
              text: category.name,
            }))}
            tags={selectedSkillCategories}
            placeholder=""
            autocomplete
            minQueryLength={1}
          />
        </LabaledBox>
        <LabaledBox className="flex-1" label="Image">
          <Input
            className="w-full"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </LabaledBox>
        <LabaledBox className="flex-1" label="Description">
          <TextArea
            className="w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </LabaledBox>
      </div>
      <div className="flex gap-4 self-end">
        <Button look="gray" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button
          look="green"
          disabled={
            name.length === 0 || slug.length === 0 || runHyperlink.length === 0
          }
          onClick={() =>
            postActivity({
              id: onExistingActivity ? activityId : tempId(),
              slug,
              name,
              short_name: shortName,
              page_hyperlink: pageHyperlink,
              run_hyperlink: runHyperlink,
              description: description ? description : undefined,
              image: image ? image : undefined,
              skill_categories: selectedSkillCategories.map((tag) => ({
                id: tag.id,
                name: tag.text,
              })),
            })
          }
        >
          Save Activity
        </Button>
      </div>
    </main>
  );
};

export default ActivityPage;
