import { useMemo, useRef, useState } from 'react';
import { fetchActivities } from './api';
import { FocusActivitiesToggle, SortBar } from './components';
import { useDeviceInfo, useQuery } from './hooks';
import './index.css';
import { c } from './lib';
import type { SidebarActivity, SortType } from './types';

const ActivitiesSidebar: React.FC = () => {
  const { mw } = useDeviceInfo();

  const containerRef = useRef<HTMLDivElement>(null);

  const [sort, setSort] = useState<SortType>('alphabet');
  const [onlyFocus, setOnlyFocus] = useState(false);

  const activities = useQuery<SidebarActivity[]>(fetchActivities, []);

  const finalActivities = useMemo(() => {
    return activities
      .filter((activity) => !onlyFocus || activity.focus)
      .sort((a1, a2) => {
        switch (sort) {
          case 'alphabet':
            return a1.name.localeCompare(a2.name);
          case 'score':
            return (a2.score || 0) - (a1.score || 0);
          case 'recent':
            return a2.last_use - a1.last_use;
          default:
            return 0;
        }
      });
  }, [activities, onlyFocus, sort]);

  return (
    <div className="flex h-full flex-col" ref={containerRef}>
      <div className="bg-[#f7f7f7] pb-4 text-xs">
        <SortBar
          sorts={[
            {
              key: 'alphabet',
              label: (
                <>
                  A <span className="text-[#bfbfbf]">to</span> Z
                </>
              ),
            },
            {
              key: 'score',
              label: 'Score',
            },
            {
              key: 'recent',
              label: 'Latest',
            },
          ]}
          selectedSort={sort}
          setSelectedSort={setSort}
          overrideMobile={mw <= 1600}
        />
      </div>
      <ActivitiesList
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#eeeeee]"
        activities={finalActivities}
      />
      <div className={c('bg-[#f7f7f7] pt-4')}>
        <FocusActivitiesToggle
          onlyFocus={onlyFocus}
          setOnlyFocus={setOnlyFocus}
          overrideMobile={mw <= 1650}
        />
      </div>
    </div>
  );
};

export default ActivitiesSidebar;

interface ActivitiesListProps extends React.HTMLAttributes<HTMLUListElement> {
  activities: SidebarActivity[];
}

const ActivitiesList: React.FC<ActivitiesListProps> = ({
  activities,
  ...rest
}) => {
  return (
    <ul {...rest}>
      {activities.map((activity, i) => {
        const last = i === activities.length - 1;

        return (
          <li key={activity.id}>
            <a
              className={c(
                'group flex h-full w-full items-center py-3 lg:px-2',
                !last && 'border-b border-b-theme-border/40'
              )}
              href={activity.page_hyperlink}
            >
              <span className="font-inter text-[14px] !font-semibold text-[#555555] group-hover:text-[#009cc2] lg:text-[15px] 2lg:text-[17px]">
                {activity.short_name || activity.name}
              </span>
              {activity.legacy ? (
                <span className="ml-4 text-sm tracking-tight text-[#bbbbbb]">
                  LEGACY
                </span>
              ) : null}
              {activity.score ? (
                <span
                  className={c(
                    'ml-auto',
                    activity.median === 'below' && 'text-[#fc5656]',
                    activity.median === 'average' && 'text-[#415e81]',
                    activity.median === 'above' && 'text-[#7ce027]'
                  )}
                >
                  <span className="font-inter text-[14px] !font-semibold lg:text-[15px] 2lg:text-[17px]">
                    {activity.score}
                  </span>
                  <span className="ml-1 text-[0.6rem] text-[#d1d1d1]">%</span>
                </span>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
