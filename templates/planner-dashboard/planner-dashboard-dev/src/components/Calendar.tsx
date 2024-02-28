import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { api } from '../client';
import { useQuery } from '../hooks';
import {
  c,
  getDatePreview,
  getMonthLabel,
  getTimePreview,
  p,
  prefix,
} from '../lib';
import { DBResult, DBTarget, Result, Target } from '../types';

interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Calendar: React.FC<CalendarProps> = ({ ...rest }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | undefined>(
    undefined
  );

  const monthDays = useMemo(() => {
    var date = new Date(
      Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    );
    var days: Date[] = [];

    while (date.getUTCMonth() === currentMonth.getMonth()) {
      days.push(new Date(date));
      date.setUTCDate(date.getDate() + 1);
    }

    date = new Date(
      Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    );
    while (days[0].getDay() !== 0) {
      date.setUTCDate(date.getDate() - 1);

      days = [new Date(date), ...days];
    }

    date = new Date(
      Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
    while (days[days.length - 1].getDay() !== 6) {
      days = [...days, new Date(date)];

      date.setUTCDate(date.getDate() + 1);
    }

    return days;
  }, [currentMonth]);

  const data = useQuery(() => fetchData(monthDays), undefined, monthDays);

  const selectedDay =
    selectedDayIndex !== undefined ? monthDays[selectedDayIndex] : undefined;

  if (!data || data.length === 0 || data.length !== monthDays.length)
    return null;

  return (
    <div
      {...rest}
      className={c(
        'flex h-full flex-col rounded-sm border-theme-border text-theme-extra-dark-gray scrollbar scrollbar-w-3 scrollbar-thumb-theme-light-gray scrollbar-track-theme-scrollbar md:border',
        rest.className
      )}
    >
      <div className="sticky left-0 right-0 top-0 z-10 bg-white">
        <div
          className="flex items-center gap-4 border-b border-b-theme-border px-4 py-4 text-lg font-semibold text-[#6b6b6b]"
          style={{
            boxShadow: 'inset 0px -4px 10px 0px rgba(0,0,0,0.01)',
          }}
        >
          <button onClick={goBackward}>
            <img
              alt="left arrow"
              src={p('icons/icon_arrow.svg')}
              className="h-3 w-3"
            />
          </button>
          <span>
            {getMonthLabel(currentMonth.getMonth())}{' '}
            {currentMonth.getFullYear()}
          </span>
          <button onClick={goForward}>
            <img
              alt="right arrow"
              src={p('icons/icon_arrow.svg')}
              className="h-3 w-3 rotate-180"
            />
          </button>
        </div>
        <ul
          className="relative hidden border-b border-b-theme-border bg-[#f7f7f7] font-semibold text-[#999999] md:flex"
          style={{
            boxShadow: 'inset 0px 4px 10px 0px rgba(0,0,0,0.025)',
          }}
        >
          {[
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ].map((day, i) => (
            <li
              className={c(
                'w-[calc(100%/7)] shrink-0 px-4 py-3 text-sm',
                i < 6 && 'border-r border-r-theme-border'
              )}
              key={i}
            >
              <span>{day}</span>
            </li>
          ))}
        </ul>
      </div>
      <ul className="flex min-h-0 flex-1 flex-wrap overflow-y-auto scrollbar-w-0">
        {monthDays.map((day, i) => (
          <DateCell
            className={c(
              'w-full shrink-0 cursor-pointer border-2 border-b border-transparent border-b-theme-border bg-white transition hover:bg-[#efefef] md:w-[calc(100%/7)]',
              (i + 1) % 7 !== 0 && 'md:border-r md:border-r-theme-border',
              i >= monthDays.length - 7 && 'md:border-b-0',
              i === monthDays.length - 1 && 'border-b-0',
              day.getMonth() !== currentMonth.getMonth()
                ? 'text-theme-light-gray'
                : 'text-theme-extra-dark-gray',
              Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()) ===
                Date.UTC(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate()
                ) && '!border-2 !border-theme-blue'
            )}
            day={day}
            data={data[i]}
            onClick={() => setSelectedDayIndex(i)}
            key={i}
          />
        ))}
      </ul>

      <div
        className={c(
          'absolute bottom-0 left-0 right-0 top-0 z-30 bg-black/40',
          selectedDay ? 'visible' : 'invisible'
        )}
      >
        <div
          className={c(
            'absolute left-0 right-0 top-0 z-20 flex h-full justify-end transition-all',
            selectedDay ? 'translate-x-0' : 'translate-x-full'
          )}
          onClick={() => setSelectedDayIndex(undefined)}
        >
          <div
            className={c(
              'relative h-full w-full bg-white transition-all md:max-w-xl',
              !selectedDay && 'translate-x-full'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute left-6 top-4 text-xl text-theme-light-gray hover:brightness-75"
              onClick={() => setSelectedDayIndex(undefined)}
            >
              <img
                alt="close icon"
                src={p('icons/icon_close.svg')}
                className="h-6 w-6"
              />
            </button>
            {selectedDayIndex !== undefined &&
              selectedDay &&
              (() => {
                const selectedDayDuration = data[
                  selectedDayIndex
                ].results.reduce((sum, result) => sum + result.duration, 0);

                const selectedDayHours = Math.floor(selectedDayDuration / 3600);
                const selectedDayMinutes = Math.floor(
                  (selectedDayDuration % 3600) / 60
                );

                return (
                  <div className="flex h-full flex-col">
                    <div className="flex w-full justify-center gap-4 pb-10 pt-16 xs:pt-10">
                      <button onClick={goDayBack}>
                        <img
                          alt="left arrow"
                          src={p('icons/icon_arrow.svg')}
                          className="h-3 w-3 opacity-60"
                        />
                      </button>
                      <span className="text-xl font-semibold text-[#5b5b5b]">
                        {getDatePreview(selectedDay.getTime())}
                      </span>
                      <button onClick={goDayForward}>
                        <img
                          alt="right arrow"
                          src={p('icons/icon_arrow.svg')}
                          className="h-3 w-3 rotate-180 opacity-60"
                        />
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col gap-6 p-6 pt-0 md:min-h-0">
                      <div className="flex flex-[4_1_0%] flex-col overflow-hidden rounded-[4px] border border-theme-border">
                        <div
                          className="border-b border-theme-border bg-white px-5 py-2 font-semibold text-[#6b6b6b]"
                          style={{
                            boxShadow:
                              'rgba(0, 0, 0, 0.01) 0px -4px 10px 0px inset',
                          }}
                        >
                          <span>Activities</span>
                        </div>
                        <div
                          className="flex flex-1 basis-0 flex-col gap-4 overflow-y-auto bg-[#f2f2f2] px-4 py-6 text-theme-medium-gray scrollbar scrollbar-w-2 scrollbar-thumb-rounded-none scrollbar-thumb-gray-300 scrollbar-track-transparent"
                          style={{
                            boxShadow:
                              'rgba(0, 0, 0, 0.024) 0px 4px 10px 0px inset',
                          }}
                        >
                          {data[selectedDayIndex].results.length === 0 ? (
                            <span>
                              You haven't completed any Activities today.
                            </span>
                          ) : (
                            data[selectedDayIndex].results.map((result, i) => (
                              <div
                                className="flex flex-col gap-2 sm:flex-row md:flex-col"
                                key={i}
                              >
                                <span className="text-[15px] tracking-wider text-[#c6c6c6] sm:w-1/4">
                                  {prefix(result.from.getHours())}:
                                  {prefix(result.from.getMinutes())} to{' '}
                                  {prefix(result.to.getHours())}:
                                  {prefix(result.to.getMinutes())}
                                </span>
                                <ResultTag
                                  className="sm:flex-1 md:flex-initial"
                                  result={result}
                                />
                              </div>
                            ))
                          )}
                        </div>
                        <div className="text-theme-dark-theme border-t border-theme-border px-5 py-2">
                          <span className="text-[#a5a5a5]">
                            <b className="mr-1 font-semibold text-[#7a7a7a]">
                              Total Time:
                            </b>
                            {selectedDayHours} hours {selectedDayMinutes}{' '}
                            minutes
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-[3_1_0%] flex-col overflow-hidden rounded-[4px] border border-theme-border">
                        <div
                          className="border-b border-theme-border bg-white px-5 py-2 font-semibold text-[#6b6b6b]"
                          style={{
                            boxShadow:
                              'rgba(0, 0, 0, 0.01) 0px -4px 10px 0px inset',
                          }}
                        >
                          <p>Targets</p>
                        </div>
                        <div
                          className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[#f2f2f2] px-4 py-6 text-theme-medium-gray scrollbar scrollbar-w-2 scrollbar-thumb-rounded-none scrollbar-thumb-gray-300 scrollbar-track-transparent"
                          style={{
                            boxShadow:
                              'rgba(0, 0, 0, 0.024) 0px 4px 10px 0px inset',
                          }}
                        >
                          {data[selectedDayIndex].targets.length === 0 ? (
                            <p>
                              No targets have expired, been set or achieved
                              today.
                            </p>
                          ) : (
                            data[selectedDayIndex].targets.map((target, i) => (
                              <div
                                className="flex flex-col gap-2 sm:flex-row md:flex-col"
                                key={i}
                              >
                                <span className="w-[calc(100%/7)] text-[15px] tracking-wider text-[#c6c6c6]">
                                  {prefix(target.time.getHours())}:
                                  {prefix(target.time.getMinutes())}
                                </span>
                                <TargetTag className="flex-1" target={target} />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      </div>
    </div>
  );

  function goBackward() {
    const newDate = new Date(currentMonth);

    newDate.setMonth(currentMonth.getMonth() - 1);

    setCurrentMonth(newDate);
  }

  function goForward() {
    const newDate = new Date(currentMonth);

    newDate.setMonth(currentMonth.getMonth() + 1);

    setCurrentMonth(newDate);
  }

  function goDayBack() {
    if (selectedDayIndex === undefined) return;

    if (selectedDayIndex - 1 < 0) {
      setSelectedDayIndex(monthDays.length - 1);
      goBackward();
    } else setSelectedDayIndex(selectedDayIndex - 1);
  }

  function goDayForward() {
    if (selectedDayIndex === undefined) return;

    if (selectedDayIndex + 1 > monthDays.length - 1) {
      setSelectedDayIndex(0);
      goForward();
    } else {
      setSelectedDayIndex(selectedDayIndex + 1);
    }
  }

  async function fetchData(
    monthDays: Date[]
  ): Promise<{ results: Result[]; targets: Target[] }[]> {
    try {
      const { data } = await api.post<
        {
          results: DBResult[];
          targets: DBTarget[];
        }[]
      >('/get-user-results-and-targets-of-range.php', { days: getDaysData() });

      return data.map((day) => ({
        results: day.results.map((result) => ({
          ...result,
          from: new Date(result.from),
          to: new Date(result.to),
        })),
        targets: day.targets.map((target) => ({
          ...target,
          time: new Date(target.time),
          start_time: new Date(target.start_time),
          end_time: new Date(target.end_time),
          achieve_time: target.achieve_time
            ? new Date(target.achieve_time)
            : undefined,
        })),
      }));
    } catch (err) {
      return Promise.reject(err);
    }

    function getDaysData() {
      return monthDays.map((day) => {
        const startDate = new Date(day);
        startDate.setUTCHours(0, 0, 0, 0);

        const start = startDate.getTime();

        const endDate = new Date(day);
        endDate.setUTCHours(23, 59, 59, 999);

        const end = endDate.getTime();

        return {
          start,
          end,
        };
      });
    }
  }
};

export default Calendar;

interface DateCellProps extends React.HTMLAttributes<HTMLLIElement> {
  day: Date;
  data: { results: Result[]; targets: Target[] };
}

const DateCell: React.FC<DateCellProps> = ({ day, data, ...rest }) => {
  if (data === undefined) console.log(day);

  const targetsSet = useMemo(() => {
    return data.targets.filter((target) => target.status === 'set');
  }, [data]);

  const targetsAchieved = useMemo(() => {
    return data.targets.filter((target) => target.status === 'achieved');
  }, [data]);

  const targetsFutureExpires = useMemo(() => {
    return data.targets.filter((target) => {
      return target.status === 'future-expire';
    });
  }, [data]);

  const targetsMissed = useMemo(() => {
    return data.targets.filter((target) => target.status === 'missed');
  }, [data]);

  const results = useMemo(() => {
    const flatResults: { [key: string]: { name: string; mul: number } } = {};

    data.results.forEach((result) => {
      if (!flatResults[result.name])
        flatResults[result.name] = {
          name: result.name,
          mul: 1,
        };
      else flatResults[result.name].mul += 1;
    });

    return Object.values(flatResults);
  }, [data.results]);

  const totalHeight =
    (targetsSet.length > 0 ? 40 : 0) +
    (targetsAchieved.length > 0 ? 40 : 0) +
    (targetsFutureExpires.length > 0 ? 40 : 0) +
    (targetsMissed.length > 0 ? 40 : 0) +
    results.length * 20;

  return (
    <li
      {...rest}
      className={c('relative flex flex-col px-4 py-2', rest.className)}
    >
      <span className="mb-2 !text-lg">{day.getDate()}</span>
      <div className="flex h-[144px] min-h-0 flex-col overflow-y-hidden">
        {targetsSet.length > 0 && (
          <CompTargetTag
            className="mb-2"
            type="set"
            multiplier={targetsSet.length}
          />
        )}
        {targetsAchieved.length > 0 && (
          <CompTargetTag
            className="mb-2"
            type="achieved"
            multiplier={targetsAchieved.length}
          />
        )}
        {targetsFutureExpires.length > 0 && (
          <CompTargetTag
            className="mb-2"
            type="future-expire"
            multiplier={targetsFutureExpires.length}
          />
        )}
        {targetsMissed.length > 0 && (
          <CompTargetTag
            className="mb-2"
            type="missed"
            multiplier={targetsMissed.length}
          />
        )}
        {results.map((result, i) => (
          <p
            className="mb-1 flex whitespace-nowrap text-sm font-semibold text-theme-extra-dark-gray"
            key={i}
          >
            <span className="md:overflow-x-hidden md:text-ellipsis">
              {result.name}
            </span>
            {result.mul > 1 && (
              <span className="ml-2 text-theme-light-gray">x{result.mul}</span>
            )}
          </p>
        ))}
      </div>
      {totalHeight > 144 && (
        <span className="text-xs font-light text-theme-light-gray">More</span>
      )}
    </li>
  );
};

interface CompTargetTagProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'set' | 'achieved' | 'future-expire' | 'missed';
  multiplier: number;
}

const CompTargetTag: React.FC<CompTargetTagProps> = ({
  type,
  multiplier,
  ...rest
}) => {
  const { label, icon, color } = (() => {
    switch (type) {
      case 'achieved':
        return {
          label: 'Target Achieved',
          icon: 'icon_target_achieved.svg',
          color: '#74d813',
        };
      case 'future-expire':
        return {
          label: 'Target Expiry',
          icon: 'icon_target_expiry.svg',
          color: '#ebb660',
        };
      case 'missed':
        return {
          label: 'Target Expired',
          icon: 'icon_target_expired.svg',
          color: '#fc5656',
        };
      case 'set':
        return {
          label: 'Target Set',
          icon: 'icon_target_set.svg',
          color: '#0d94c5',
        };
    }
  })();

  return (
    <div
      {...rest}
      className={c(
        'min-h-9 relative flex shrink-0 items-center overflow-hidden rounded-md border border-theme-border bg-white p-1 text-[#828282] shadow-md md:p-[2px] md:text-xs lg:p-1 lg:text-sm',
        rest.className
      )}
    >
      <img
        alt="target status icon"
        className="hidden h-6 w-6 xl:block"
        src={p(`icons/${icon}`)}
      />
      <span className="pl-2">{label}</span>
      {multiplier > 1 && (
        <span className="ml-auto mr-2 whitespace-nowrap text-theme-light-gray">
          x {multiplier}
        </span>
      )}
      <div
        className="absolute right-0 top-0 h-full w-1"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

interface ResultTagProps extends React.HTMLAttributes<HTMLDivElement> {
  result: Result;
}

const ResultTag: React.FC<ResultTagProps> = ({ result, ...rest }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [imageWidth, setImageWidth] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    setImageWidth(containerRef.current.clientHeight * 1.198);
  }, []);

  const gradeColor = (() => {
    switch (result.stanine) {
      case 'above':
        return '#74d813';
      case 'average':
        return '#0d94c5';
      case 'below':
        return '#fc5656';
    }
  })();

  return (
    <div
      {...rest}
      className={c(
        'relative flex cursor-pointer gap-4 overflow-hidden rounded-[4px] border border-theme-border bg-white shadow-sm xs:h-24',
        rest.className
      )}
      onClick={() =>
        window.location.replace(
          `${import.meta.env.VITE_PERFORMANCE_URL}?filter-key=activity-${
            result.id
          }-${result.name}`
        )
      }
      ref={containerRef}
    >
      {result.mode === 'training' && (
        <div className="absolute bottom-0 h-[3px] w-full bg-theme-green" />
      )}
      <img
        alt="activity thumbnail"
        className="relative h-full border-r border-r-[#ccc] xs:w-24"
        src={result.image}
        style={{ width: imageWidth }}
      />
      <div className="flex flex-1 flex-col justify-center gap-3 py-2 pr-4 xs:flex-row xs:items-center xs:justify-between xs:gap-1 xs:py-0">
        <div className="flex min-w-0 flex-col gap-3 truncate">
          <div className="flex items-center gap-2">
            <span className="block truncate font-inter !text-base !font-semibold text-[#777777]">
              <span className="hidden md:inline-block">{result.name}</span>
              <span className="md:hidden">
                {result.short_name || result.name}
              </span>
            </span>
            {result.mode === 'training' && result.high_score && (
              <img
                alt="training mode icon"
                className="h-6 w-6"
                src={p('icons/icon_mortarboard.svg')}
              />
            )}
            {/* {result.mode === 'training' && result.high_score && (
              <img
                alt="training mode icon"
                className="-transalte-x-1/2 absolute right-2 top-2 hidden h-12 w-12 -translate-y-1/2 -rotate-[35deg]"
                src={p('icons/icon_mortarboard.svg')}
              />
            )} */}
          </div>
          {result.mode === 'training' && !result.high_score && (
            <div className="flex items-center gap-1 text-xs font-semibold text-theme-green">
              <img
                alt="training mode icon"
                className="h-4 w-4"
                src={p('icons/icon_mortarboard.svg')}
              />
              <span>Training Mode</span>
            </div>
          )}
          {result.high_score && (
            <div className="hidden items-center gap-2 self-start rounded-[6px] border border-[#98cdf1] bg-[#a1daff59] px-[10px] py-[6px] font-inter text-[13px] font-semibold text-[#509ffff0] xs:flex">
              <img
                alt="star icon"
                className="h-4 w-4"
                src={p('icons/star_blue.svg')}
              />
              <span>New High Score!</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="block shrink-0 !text-[15px] font-semibold text-[#b2b2b2]">
            <span style={{ color: gradeColor }}>{result.score}</span>{' '}
            <span className="text-sm font-normal">out of</span>{' '}
            <span className="text-[#888]">100</span>
          </span>
          {result.high_score && (
            <div className="rounded-full border border-[#98cdf1] bg-[#a1daff59] p-[4px] xs:hidden">
              <img
                alt="star icon"
                className="h-3 w-3"
                src={p('icons/star_blue.svg')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TargetTagProps extends React.HTMLAttributes<HTMLDivElement> {
  target: Target;
}

const TargetTag: React.FC<TargetTagProps> = ({ target, ...rest }) => {
  const { label, icon, color } = (() => {
    switch (target.status) {
      case 'achieved':
        return {
          label: 'Target Achieved',
          icon: 'icon_target_achieved.svg',
          color: '#74d813',
        };
      case 'future-expire':
        return {
          label: 'Target Expiry',
          icon: 'icon_target_expiry.svg',
          color: '#ebb660',
        };
      case 'missed':
        return {
          label: 'Target Missed',
          icon: 'icon_target_expired.svg',
          color: '#fc5656',
        };
      case 'set':
        return {
          label: 'Target Set',
          icon: 'icon_target_set.svg',
          color: '#0d94c5',
        };
    }
  })();

  const desc1 = (() => {
    switch (target.type) {
      case 'improvement':
        return `Achieve Improvement of ${target.figure}% in ${target.name}`;
      case 'score':
        return `Achieve Score of ${target.figure}% in ${target.name}`;
      case 'time':
        return `Achieve time of ${target.figure} hour${
          target.figure > 1 ? 's' : ''
        } in ${target.name}`;
    }
  })();

  const desc2 = (() => {
    switch (target.status) {
      case 'set':
        return `by ${getTimePreview(target.end_time.getTime())}`;
      case 'achieved':
        return `achieved today at ${prefix(target.time.getHours())}:${prefix(
          target.time.getMinutes()
        )}`;
      case 'missed':
        return `missed today at ${prefix(target.time.getHours())}:${prefix(
          target.time.getMinutes()
        )}`;
      case 'future-expire':
        return `expires at ${prefix(target.time.getHours())}:${prefix(
          target.time.getMinutes()
        )}`;
    }
  })();

  return (
    <div
      {...rest}
      className={c(
        'relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-md border border-theme-border bg-white py-[15px] pl-3 pr-4 shadow-sm',
        rest.className
      )}
      onClick={() =>
        window.location.replace(
          `${import.meta.env.VITE_PERFORMANCE_URL}?filter-key=${
            target.target_type
          }-${target.target_id}-${target.name}`
        )
      }
    >
      <div
        className="absolute bottom-0 right-0 top-0 w-1"
        style={{ backgroundColor: color }}
      ></div>
      <img
        alt="target status icon"
        className="h-14 w-14"
        src={p(`icons/${icon}`)}
      />
      <div className="flex flex-col gap-1">
        <span className="font-inter !text-[15px] font-semibold text-[#666]">
          {label}
        </span>
        <span className="!text-[13px] !font-normal text-[#999]">
          {desc1} <span className="font-semibold text-[#666]">{desc2}</span>.
        </span>
      </div>
    </div>
  );
};
