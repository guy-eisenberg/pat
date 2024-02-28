import { useMemo, useState } from 'react';
import { useDeviceInfo } from '../../hooks';
import { c } from '../../lib';
import type {
  ActivityPerformance,
  OverallPerformance,
  PerformanceType,
  SkillPefromance,
  SortType,
} from '../../types';
import {
  ImprovementProgress,
  ImprovementRateIndicator,
  InformationTable,
  TargetsInformation,
} from '../common';
import {
  FocusActivitiesToggle,
  HorizontalRadio,
  ProgressBar,
  ScorePie,
  Slide,
  Slideshow,
  SortBar,
} from '../core';

interface PerformanceOverviewTabProps {
  performance: OverallPerformance;
  goToDaybydayTab: (filterKey: string) => void;
}

const PerformanceOverviewTab: React.FC<PerformanceOverviewTabProps> = ({
  performance,
  goToDaybydayTab,
}) => {
  return (
    <>
      <div className="hidden border-b border-[#e0e0e0] md:flex">
        <div className="flex w-1/4 flex-1 items-center justify-around gap-4 border-r border-r-theme-border p-2 md:flex-1 md:p-4 2md:flex-[2] xl:flex-1">
          <ScorePie
            className="h-[160px] w-[160px] shrink-0 lg:h-[170px] lg:w-[170px]"
            score={performance.score}
            median={performance.median}
            fontSize={72}
            lineHeight="82px"
          />
          <ImprovementRateIndicator
            className="shrink-0 md:hidden 2md:flex"
            improvementRate={performance.improvement_rate_speed}
          />
        </div>
        <InformationTable
          className="border-r border-r-theme-border md:flex-[3] xl:flex-[2]"
          scores={performance.all_scores}
          overallImprovement={performance.overall_improvement}
          improvementRate={performance.improvement_rate}
          time={performance.total_duration}
          runs={performance.runs}
          fontSize={32}
        />
        <div className="flex flex-1 flex-col 2md:flex-[2] xl:flex-row">
          <ImprovementProgress
            className="flex-1 p-4"
            progressBarClassName="md:scale-[0.85] px-8 xl:scale-100"
            stages={performance.scores_segments}
          />
          <TargetsInformation
            className="overflow-hidden xl:m-8 xl:rounded-md xl:!border"
            active={performance.targets.active}
            achieved={performance.targets.achieved}
            missed={performance.targets.missed}
            wrap
          />
        </div>
      </div>

      <Slideshow className="md:hidden" frameDots>
        <Slide className="flex justify-evenly pb-16 pt-12">
          <ScorePie
            className="h-[200px] w-[200px]"
            score={performance.score}
            median={performance.median}
          />
          <ImprovementRateIndicator
            improvementRate={performance.improvement_rate_speed}
          />
        </Slide>
        <Slide className="flex flex-col">
          <InformationTable
            className="h-full"
            scores={performance.all_scores}
            overallImprovement={performance.overall_improvement}
            improvementRate={performance.improvement_rate}
            time={performance.total_duration}
            runs={performance.runs}
            labelFontSize={16}
            fontSize={30}
          />
          <div className="h-10 w-1/2 border-r border-r-theme-border"></div>
        </Slide>
        <Slide className="flex">
          <ImprovementProgress
            className="flex-1 p-6"
            stages={performance.scores_segments}
            progressBarClassName="px-6"
            style={{ boxShadow: '5px 0px 15px 0px rgba(0,0,0,0.08)' }}
          />
          <TargetsInformation
            active={performance.targets.active}
            achieved={performance.targets.achieved}
            missed={performance.targets.missed}
          />
        </Slide>
      </Slideshow>
      <PerformanceOverviewMain
        activityPerformances={performance.activities}
        skillPerformances={performance.skills}
        goToDaybydayTab={goToDaybydayTab}
        className="flex-1"
      />
    </>
  );
};

export default PerformanceOverviewTab;

interface OverviewMainProps extends React.HTMLAttributes<HTMLDivElement> {
  activityPerformances: ActivityPerformance[];
  skillPerformances: SkillPefromance[];
  goToDaybydayTab: (filterKey: string) => void;
}

const PerformanceOverviewMain: React.FC<OverviewMainProps> = ({
  activityPerformances,
  skillPerformances,
  goToDaybydayTab,
  ...rest
}) => {
  const { mw } = useDeviceInfo();

  const [showType, setShowType] = useState<PerformanceType>('activity');
  const [onlyFocus, setOnlyFocus] = useState(false);
  const [sort, setSort] = useState<SortType>('alphabet');

  const filteredPerformances = useMemo(() => {
    const performances =
      showType === 'activity' ? activityPerformances : skillPerformances;

    if (showType === 'activity' && onlyFocus)
      return performances.filter(
        (performance) => (performance as ActivityPerformance).focus
      );

    return performances;
  }, [activityPerformances, skillPerformances, onlyFocus, showType]);

  const sortedPerformances = useMemo(() => {
    switch (sort) {
      case 'alphabet':
        return filteredPerformances.sort((p1, p2) =>
          p1.name.localeCompare(p2.name)
        );
      case 'score':
        return filteredPerformances.sort(
          (p1, p2) => (p2.score || 0) - (p1.score || 0)
        );
      case 'recent':
        return filteredPerformances.sort((p1, p2) => p2.last_use - p1.last_use);
      case 'time':
        return filteredPerformances.sort(
          (p1, p2) => p2.total_duration - p1.total_duration
        );
    }
  }, [filteredPerformances, sort]);

  return (
    <div
      {...rest}
      className={c('flex flex-col gap-4 p-2 md:gap-8 md:p-4', rest.className)}
      style={{
        background:
          'linear-gradient(180deg,rgba(247,247,247,1) 0%,rgba(247,247,247,.75) 75%,rgba(255,255,255,1) 100%)',
        boxShadow: 'rgb(0 0 0 / 2%) 0px 4px 10px 0px inset',
      }}
    >
      <div className="flex items-center justify-between text-sm">
        <HorizontalRadio
          options={[
            { key: 'activity', label: 'Activity' },
            { key: 'skill', label: 'Skill' },
          ]}
          className="[&_.select-option]:!px-4 [&_.select-option]:!py-2 sm:[&_.select-option]:!px-6 md:[&_.select-option]:!px-4"
          selectedOption={showType}
          onOptionChange={(type) => setShowType(type as 'activity' | 'skill')}
        />
        <div className="flex gap-4">
          {showType === 'activity' && (
            <FocusActivitiesToggle
              className="hidden md:flex"
              onlyFocus={onlyFocus}
              setOnlyFocus={setOnlyFocus}
            />
          )}
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
                label: 'Recently Used',
              },
              {
                key: 'time',
                label: 'Time',
              },
            ]}
            className="[&_.sort-option]:!px-4 [&_.sort-option]:!py-2 sm:[&_.sort-option]:!px-6 md:[&_.sort-option]:!px-4"
            selectedSort={sort}
            setSelectedSort={setSort}
            overrideMobile={mw <= 870}
          />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {sortedPerformances.map((performance) => (
          <PerformanceCard
            performance={performance}
            onClick={() =>
              goToDaybydayTab(
                `${showType}-${performance.id}-${performance.name}`
              )
            }
            key={performance.id}
          />
        ))}
      </div>
    </div>
  );
};

interface PerformanceCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  performance: ActivityPerformance | SkillPefromance;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  performance,
  ...rest
}) => {
  if (!performance.scores_segments) performance.scores_segments = [0, 0, 0];

  return (
    <button
      {...rest}
      className={c(
        'overflow-hidden rounded-[6px] border border-[#dfdfdf] bg-white transition hover:border-theme-blue hover:shadow-menu-box',
        rest.className
      )}
      style={{ boxShadow: 'rgba(50, 50, 50, 0.035) 0px 0px 6px 1px' }}
    >
      <div
        className="flex justify-between border-b border-b-theme-border p-4"
        style={{ boxShadow: '0px 5px 10 0px rgba(0,0,0,0.1)' }}
      >
        <div className="flex flex-col justify-around text-left">
          <span className="hidden text-xl text-theme-dark-gray xl:inline-block">
            {performance.name}
          </span>
          <span className="text-xl text-theme-dark-gray xl:hidden">
            {performance.short_name || performance.name}
          </span>
          <span className="text-lg text-theme-medium-gray">
            {Math.floor(performance.total_duration / 3600)}{' '}
            <span className="text-base text-theme-light-gray">hours</span>{' '}
            {Math.floor((performance.total_duration % 3600) / 60)}{' '}
            <span className="text-base text-theme-light-gray">mins</span>
          </span>
        </div>
        <ScorePie
          className="h-[75px] w-[75px] shrink-0"
          score={performance.score || 0}
          median={performance.median}
          precentage={false}
          showPlane={false}
          fontSize={26}
        />
      </div>
      <div className="flex gap-6 px-4 py-6">
        <ProgressBar
          stages={performance.scores_segments}
          showLabels={false}
          showCircles={false}
        />
        {performance.scores_segments[1] !== undefined && (
          <span className="text-theme-dark-gray">
            {performance.scores_segments[1] >= performance.scores_segments[0]
              ? '+'
              : '-'}{' '}
            {Math.abs(
              performance.scores_segments[1] - performance.scores_segments[0]
            )}{' '}
            <span className="text-xs text-theme-light-gray">%</span>
          </span>
        )}
      </div>
    </button>
  );
};
