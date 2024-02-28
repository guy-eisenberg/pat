import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { c, p } from '../../lib';
import { Activity, Strategy } from '../../types';

interface ActivitiesTabProps {
  strategy: Strategy;
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ strategy }) => {
  const prepareActivities = useMemo(
    () =>
      strategy.activities
        .filter((activity) => activity.segment === 'prepare')
        .sort((a1, a2) => a1.name.localeCompare(a2.name)),
    [strategy.activities]
  );

  const weaknessActivities = useMemo(
    () =>
      strategy.activities
        .filter((activity) => activity.segment === 'weakness')
        .sort((a1, a2) => a1.name.localeCompare(a2.name)),
    [strategy.activities]
  );

  return (
    <>
      <div>
        <div className="mb-4 flex items-center gap-3">
          <img
            alt="mortarboard icon"
            className="mb-1 h-7 w-7"
            src={p('icons/bulletpoint_mortarboard.svg')}
          />
          <span className="font-inter text-lg font-semibold text-[#919191]">
            <span style={{ color: strategy?.assessor_color }}>
              {prepareActivities.length}{' '}
              {prepareActivities.length > 1 ? 'Activities' : 'Activity'}
            </span>{' '}
            for your <span className="text-[#4c4c4c]">Test Preparation</span>
          </span>
        </div>
        <div className="md:ml-8">
          <span className="mb-6 block text-[15px] leading-6 text-[#545454] md:leading-8">
            From information available, we have identified that you are likely
            to be undertaking a{' '}
            <span className="font-inter font-semibold">
              {strategy.focus_assessment_name}
            </span>{' '}
            computerised pilot aptitude test in your{' '}
            <span className="font-inter font-semibold">
              {strategy.assessor_name}
            </span>{' '}
            assessment.
            <br />
            <br />
            <br className="md:hidden" />
            The activities shown below will specifically aid in your preparation
            for this test:
          </span>
          <div className="mb-6 flex flex-col flex-wrap gap-6 md:flex-row">
            {prepareActivities.map((activity) => (
              <ActivityCard activity={activity} key={activity.id} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 font-inter text-xs font-semibold text-[#545454] md:text-sm">
            <span className="whitespace-nowrap">
              We’ve added these activities to:
            </span>
            <a href={import.meta.env.VITE_FOCUS_ACTIVITIES_URL}>
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-theme-border bg-white px-3 py-2 shadow-md shadow-[#e3e3e378] hover:ring-1 hover:ring-theme-green">
                <img
                  alt="mortarboard icon"
                  src={p('icons/focus_activity_active.svg')}
                  className="h-5 w-5"
                />
                <span>Focus Activities</span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-center gap-3">
          <img
            alt="mortarboard icon"
            className="mb-1 h-7 w-7"
            src={p('icons/bulletpoint_mortarboard.svg')}
          />
          <span className="font-inter text-lg font-semibold text-[#919191]">
            <span style={{ color: strategy?.assessor_color }}>
              {weaknessActivities.length}{' '}
              {weaknessActivities.length > 1 ? 'Activities' : 'Activity'}
            </span>{' '}
            to improve your <span className="text-[#4c4c4c]">Weaknesses</span>
          </span>
        </div>
        <div className="md:ml-8">
          <span className="mb-6 block text-[15px] leading-6 text-[#545454] md:leading-8">
            You have stated that you would like to improve your competencies in{' '}
            {strategy.skill_categories_names.map((name, i) => (
              <React.Fragment key={i}>
                {i === strategy.skill_categories_names.length - 1 && 'and '}
                <span className="font-inter font-semibold">{name}</span>
                {i < strategy.skill_categories_names.length - 1 && ', '}
              </React.Fragment>
            ))}
            .
            <br />
            <br />
            <br className="md:hidden" /> We’ve selected activities which will
            help to improve your competencies in these areas.
          </span>
          <div className="mb-6 flex flex-col flex-wrap gap-6 2md:flex-row">
            {weaknessActivities.map((activity) => (
              <ActivityCard activity={activity} key={activity.id} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 font-inter text-xs font-semibold text-[#545454] md:text-sm">
            <span className="whitespace-nowrap">
              We’ve added these activities to:
            </span>
            <a href={import.meta.env.VITE_FOCUS_ACTIVITIES_URL}>
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-theme-border bg-white px-3 py-2 shadow-md shadow-[#e3e3e378] hover:ring-1 hover:ring-theme-green">
                <img
                  alt="mortarboard icon"
                  src={p('icons/focus_activity_active.svg')}
                  className="h-5 w-5"
                />
                <span>Focus Activities</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivitiesTab;

const DUMMY_ACTIVITIES: Activity[] = [
  {
    id: '0',
    name: 'Calculate',
    image:
      'https://insights.quiet.ly/wp-content/uploads/2018/02/calculation.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    page_hyperlink: '',
    segment: 'prepare',
  },
  {
    id: '0',
    name: 'Calculate',
    image:
      'https://insights.quiet.ly/wp-content/uploads/2018/02/calculation.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    page_hyperlink: '',
    segment: 'prepare',
  },
  {
    id: '0',
    name: 'Aviation',
    image:
      'https://insights.quiet.ly/wp-content/uploads/2018/02/calculation.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    page_hyperlink: '',
    segment: 'prepare',
  },
  {
    id: '0',
    name: 'Calculate',
    image:
      'https://insights.quiet.ly/wp-content/uploads/2018/02/calculation.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    page_hyperlink: '',
    segment: 'prepare',
  },
  {
    id: '0',
    name: 'Calculate',
    image:
      'https://insights.quiet.ly/wp-content/uploads/2018/02/calculation.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    page_hyperlink: '',
    segment: 'prepare',
  },
  {
    id: '0',
    name: 'Dog',
    image:
      'https://insights.quiet.ly/wp-content/uploads/2018/02/calculation.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    page_hyperlink: '',
    segment: 'prepare',
  },
  {
    id: '0',
    name: 'Brown',
    image:
      'https://insights.quiet.ly/wp-content/uploads/2018/02/calculation.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    page_hyperlink: '',
    segment: 'prepare',
  },
];

interface ActivityCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, ...rest }) => {
  const containerRef = useRef<HTMLAnchorElement>(null);

  const [imageWidth, setImageWidth] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    setImageWidth(containerRef.current.clientHeight * 1.198);
  }, []);

  return (
    <a
      {...rest}
      href={activity.page_hyperlink}
      className={c(
        'flex h-32 w-full items-center rounded-[3px] border border-theme-border bg-white shadow-md shadow-[#e3e3e378] hover:ring-1 hover:ring-theme-green 2md:w-96',
        rest.className
      )}
      ref={containerRef}
    >
      <img
        alt="activity thumbnail"
        className="h-full shrink-0 border-r border-[#ccc]"
        style={{ width: imageWidth }}
        src={activity.image}
      />
      <div className="flex h-full flex-col gap-1 p-3">
        <span className="font-inter text-[17px] font-semibold text-[#525252]">
          {activity.name}
        </span>
        <span className="relative flex-1 overflow-hidden text-xs leading-5 text-theme-medium-gray">
          {activity.description}
          <div className="absolute -bottom-[5px] left-0 right-0 top-0 bg-gradient-to-b from-transparent from-30% to-white to-100% xs:hidden 2md:block" />
        </span>
      </div>
    </a>
  );
};
