import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchAssessments,
  fetchAssessors,
  postAsssessor as _postAsssessor,
} from '../api';
import { AutoCompleteInput, Button, Input, LabaledBox } from '../components';
import HorizontalRadio from '../components/HorizontalRadio';
import { useLoadingScreen } from '../hooks';
import { p, reportSuccess, tempId } from '../lib';
import { Assessment, AssessorType } from '../types';

const AssessorPage: React.FC = () => {
  const navigate = useNavigate();
  const { assessorId } = useParams();

  const queryClient = useQueryClient();

  const {
    isLoading: availableAssessmentsLoading,
    error: availableAssessmentsError,
    data: availableAssessments,
  } = useQuery(['available-activities'], fetchAssessments);

  const {
    isLoading: assessorsLoading,
    error: assessorsError,
    data: assessors,
  } = useQuery(['assessments'], fetchAssessors);

  const {
    isLoading: postAssessorLoading,
    error: postAssessorError,
    mutate: postAssessor,
  } = useMutation(_postAsssessor, {
    onSuccess: async (assessmentId) => {
      await queryClient.invalidateQueries(['assessments']);

      reportSuccess('Assessment was successfully saved.');

      navigate(`/${assessmentId}`);
    },
  });

  const onExistingAssessor =
    assessorId && assessorId !== 'new' && !isNaN(parseInt(assessorId));

  const assessor = useMemo(() => {
    return onExistingAssessor && assessors
      ? assessors.find((assessor) => assessor.id === assessorId)
      : undefined;
  }, [assessorId, onExistingAssessor, assessors]);

  const [activityQuery, setActivityQuery] = useState('');

  const [name, setName] = useState('');
  const [type, setType] = useState<AssessorType>('school');
  const [assessment, setAssessment] = useState<Assessment | undefined>(
    undefined
  );
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [image, setImage] = useState('');

  const assessmentsOptions = useMemo(() => {
    if (!availableAssessments) return [];

    return availableAssessments
      .filter((a) => a.id !== assessment?.id)
      .map((assessment) => ({
        id: assessment.id,
        label: assessment.name,
      }));
  }, [availableAssessments, assessment]);

  useEffect(() => {
    if (!assessor) return;

    setName(assessor.name);
    setType(assessor.type);
    setAssessment(assessor.assessment);
    setColor(assessor.color || DEFAULT_COLOR);
    setImage(assessor.image || '');
  }, [assessor]);

  useLoadingScreen(
    availableAssessmentsLoading || assessorsLoading || postAssessorLoading,
    availableAssessmentsError || assessorsError || postAssessorError
  );

  return (
    <main className="flex flex-col gap-4">
      <h1 className="mb-6 text-4xl">
        {onExistingAssessor ? 'Edit Assessor' : 'Add New Assessor'}
      </h1>
      <LabaledBox className="flex-1" label="Name">
        <Input
          className="w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </LabaledBox>
      <div className="flex items-start gap-4">
        <LabaledBox className="w-1/6" label="Assessor Type">
          <HorizontalRadio
            className="w-full"
            options={[
              {
                key: 'school',
                label: 'Flying School',
              },
              { key: 'airline', label: 'Airline' },
            ]}
            selectedOptionKey={type}
            onOptionSelect={(key) => setType(key as AssessorType)}
          />
        </LabaledBox>
        <LabaledBox className="flex-1" label="Related Assessment">
          {assessment ? (
            <div className="flex w-full items-center rounded-md border border-theme-light-gray bg-white py-3 px-5">
              <span>{assessment.name}</span>
              <button
                className="ml-auto hover:brightness-75"
                onClick={() => setAssessment(undefined)}
              >
                <img
                  alt="delete icon"
                  className="w-6"
                  src={p('icons/delete_icon.svg')}
                />
              </button>
            </div>
          ) : (
            <AutoCompleteInput
              placeholder="Search for an Assessment"
              className="w-full"
              value={activityQuery}
              onChange={(e) => setActivityQuery(e.target.value)}
              options={assessmentsOptions}
              onOptionSelect={(option) => {
                if (!availableAssessments) return;

                const assessment = availableAssessments.find(
                  (assessment) => assessment.id === option.id
                );

                setAssessment(assessment);
                setActivityQuery('');
              }}
            />
          )}
        </LabaledBox>
      </div>
      <div className="flex items-start gap-4">
        <LabaledBox label="Color">
          <div
            className="mb-4 h-12 w-full rounded-md"
            style={{ backgroundColor: color }}
          />
          <HexColorPicker color={color} onChange={setColor} className="mb-2" />
          <Input
            placeholder="#FF000F"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full"
          />
        </LabaledBox>
        <LabaledBox className="flex-1" label="Image">
          {image && (
            <img
              src={image}
              className="mx-auto mb-4 h-52 w-96"
              alt="assessor"
            />
          )}
          <Input
            className="w-full"
            value={image}
            onChange={(e) => setImage(e.target.value)}
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
            name.length === 0 || assessment === undefined || color.length !== 7
          }
          onClick={() => {
            if (!assessment) return;

            postAssessor({
              id: onExistingAssessor ? assessorId : tempId(),
              name,
              type,
              assessment,
              color,
              image: image.length > 0 ? image : undefined,
            });
          }}
        >
          Save Assessor
        </Button>
      </div>
    </main>
  );
};

export default AssessorPage;

const DEFAULT_COLOR = '#ff000f';
