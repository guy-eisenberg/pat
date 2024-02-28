import { useMemo } from 'react';
import { fetchActivityPerformance } from './api';
import {
  ImprovementProgress,
  ImprovementRateIndicator,
  InformationTable,
  RecentActivityGraph,
  ScorePie,
  TargetsInformation,
} from './components';
import { useQuery } from './hooks';

const ActivityPerformance: React.FC<{ activity: string }> = ({ activity }) => {
  const performance = useQuery(
    () => fetchActivityPerformance(activity),
    undefined,
    activity
  );

  const recentActivityFigures = useMemo(() => {
    if (!performance || !performance.previous_days_scores) return null;

    return performance.previous_days_scores.map((score, i) => {
      const date = new Date();

      date.setDate(date.getDate() - (i + 1));

      return {
        date,
        score,
      };
    });
  }, [performance]);

  if (!performance) return null;

  return (
    <div className="flex w-full flex-col md:gap-8 xl:flex-row xl:gap-4">
      <div className="relative flex flex-1 flex-col overflow-hidden border border-theme-border md:flex-row md:rounded-md xl:flex-[5_1_0%] 3xl:flex-1">
        {/* <button className="absolute left-2 top-2">
          <a href=".">
            <img alt="info" className="h-6 w-6" src={p('icons/info.svg')} />
          </a>
        </button> */}
        <div className="flex flex-1 items-center justify-center gap-6 border-b border-b-theme-border border-r-theme-border p-3 md:border-b-0 md:border-r">
          <ScorePie
            className="h-[180px] w-[180px] shrink-0 xl:h-[160px] xl:w-[160px] 3xl:h-[180px] 3xl:w-[180px]"
            fontSize={72}
            lineHeight="82px"
            score={performance.score}
            median={performance.median}
          />
          <ImprovementRateIndicator
            className="h-[90%] xl:h-4/5 3xl:h-[90%]"
            improvementRate={performance.improvement_rate_speed}
          />
        </div>
        <ImprovementProgress
          className="min-h-[200px] flex-1 p-4 md:min-h-[unset]"
          progressBarClassName="px-6"
          stages={performance.scores_segments}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden border border-t-0 border-theme-border md:flex-row md:rounded-md md:border-t xl:flex-[4_1_0%] 3xl:flex-1">
        <InformationTable
          className="min-h-[200px] flex-1 border-b border-r-0 border-b-theme-border md:min-h-[unset] md:border-b-0 md:border-r-0 lg:border-r xl:border-r-0 3xl:border-r"
          scores={performance.all_scores}
          overallImprovement={performance.overall_improvement}
          improvementRate={performance.improvement_rate}
          time={performance.total_duration}
          runs={performance.runs}
          fontSize={30}
        />
        <div className="flex min-h-[200px] flex-1 justify-center md:min-h-[unset] md:flex-initial lg:flex-1 xl:flex-initial 3xl:flex-1">
          <RecentActivityGraph
            className="flex pt-4 md:hidden lg:flex xl:hidden 3xl:flex"
            figures={recentActivityFigures}
          />
          <TargetsInformation
            active={performance.targets.active}
            achieved={performance.targets.achieved}
            missed={performance.targets.missed}
            style={{ boxShadow: 'inset 5px 0px 15px 0px rgba(0,0,0,0.04)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityPerformance;
