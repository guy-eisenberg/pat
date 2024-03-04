import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { fetchDatesPerformance } from "../../api";
import { useDeviceInfo, useQuery } from "../../hooks";
import {
  c,
  destructTime,
  getDatePreview,
  getFloatString,
  getMonthName,
  getMonthShort,
  getTimePreview,
  isSameDate,
  p,
  prefix,
} from "../../lib";
import getSmallDatePreview from "../../lib/utils/getSmallDatePreview";
import type {
  DatePeformance,
  ImprovementBreakdownComponent,
  Result,
  Target,
  TimeBreakdownComponent,
} from "../../types";
import { ImprovementGraph } from "../common";
import { Dropdown, HorizontalRadio, ProgressBar, ScorePie } from "../core";

type ViewMode = "score" | "improvement";
type SidebarViewMode = "statistics" | "activity";

const SEGMENTS_PER_VIEW = 21;

const PerformanceDaybydayTab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const segmentsContainer = useRef<HTMLDivElement>(null);

  const { orientation } = useDeviceInfo();

  const [topFilterTop, setTopFilterTop] = useState(0);
  const [renderGraphKey, setRenderGraphKey] = useState(0);

  const [segmentWidth, setSegmentWidth] = useState(0);

  const [viewMode, setViewMode] = useState<ViewMode>("score");
  const [filterMode, setFilterMode] = useState<string>("all");

  const [hoveredSegment, setHoveredSegment] = useState<number | undefined>(
    undefined
  );
  const [showPopup, setShowPopup] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [pivotDate, setPivotDate] = useState(
    (() => {
      const date = new Date();

      date.setDate(date.getDate() + 11);

      return date;
    })()
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const accentColor = viewMode === "score" ? "#46aae1" : "#7bdd2f";

  const dates = useMemo(() => {
    const previousDates = new Array(21)
      .fill(null)
      .map((_, i) => {
        const date = new Date(pivotDate.getTime());

        date.setDate(date.getDate() - (i + 1));

        return date;
      })
      .reverse();

    return previousDates;
  }, [pivotDate]);

  const datesPerformance = useQuery(
    async () => {
      const [type, id] = filterMode.split("-");

      const performances = await fetchDatesPerformance(
        dates[0],
        dates[dates.length - 1],
        filterMode === "all"
          ? undefined
          : {
              type: type as "activity" | "skill",
              id,
            }
      );

      return performances;
    },
    { performances: [], available_activities: [], available_skills: [] },
    dates,
    filterMode
  );

  const selectedDateIndex = useMemo(
    () => dates.findIndex((date) => isSameDate(date, selectedDate)),
    [dates, selectedDate]
  );

  const selectedPerformance = useMemo(
    () =>
      selectedDateIndex !== undefined
        ? datesPerformance.performances[selectedDateIndex]
        : undefined,
    [datesPerformance, selectedDateIndex]
  );

  const topData = useMemo(() => {
    return dates.map((date) => {
      const performance = datesPerformance.performances.find((performance) =>
        isSameDate(performance.date, date)
      );

      const score = performance ? performance.score || 0 : 0;
      const improvement = performance ? performance.improvement_rate || 0 : 0;

      return {
        data: viewMode === "improvement" ? improvement : score,
        score,
        improvement,
      };
    });
  }, [dates, datesPerformance, viewMode]);

  const noImprovement = useMemo(() => {
    return (
      viewMode === "improvement" &&
      datesPerformance.performances.every(
        (per) =>
          per.improvement_rate ===
          datesPerformance.performances[0].improvement_rate
      )
    );
  }, [viewMode, datesPerformance]);

  const noScore = useMemo(() => {
    return (
      viewMode === "score" &&
      datesPerformance.performances.every(
        (per) =>
          per.activity.length === 0 ||
          per.activity.every((act) => act.activity_type === "target")
      )
    );
  }, [viewMode, datesPerformance]);

  const { topDataAxis, topDataDomain } = useMemo(() => {
    var min = 0,
      max = 0;

    if (viewMode === "improvement") {
      topData.forEach((data) => {
        const n = data.data || 0;

        if (n > max) max = n;
      });
    } else max = 100;

    const domain = [min, max];

    const axis: string[] = [];
    const diff = (max - min) / 10;

    for (let i = 0; i <= 10; i++) {
      const y = max - diff * i;

      axis.push(y % 1 === 0 ? y.toString() : getFloatString(y));
    }

    return { topDataAxis: [...new Set(axis)], topDataDomain: domain };
  }, [viewMode, topData]);

  const bottomData = useMemo(() => {
    return dates.map((date, i) => {
      const performance = datesPerformance.performances.find((performance) =>
        isSameDate(performance.date, date)
      );

      return {
        time: performance ? performance.total_duration : 0,
        fill:
          selectedDateIndex === i
            ? accentColor
            : viewMode === "score"
              ? "#c9eaf9"
              : "#caf79f",
      };
    });
  }, [accentColor, viewMode, dates, datesPerformance, selectedDateIndex]);

  const { bottomDataAxis, bottomDataDomain } = useMemo(() => {
    var min = 0,
      max = 0;

    bottomData.forEach((data) => {
      const n = data.time || 0;

      if (n > max) max = n;
    });

    max = Math.max(4, max);

    const domain = [min, max];

    const axis: string[] = [];
    const diff = (max - min) / 4;

    for (let i = 0; i <= 4; i++) {
      const y = (max - diff * i) / 3600;

      axis.push(y % 1 === 0 ? y.toString() : getFloatString(y));
    }
    return { bottomDataAxis: [...new Set(axis)], bottomDataDomain: domain };
  }, [bottomData]);

  useEffect(() => {
    if (!containerRef.current || !containerRef.current.parentElement) return;

    const top =
      (containerRef.current.parentElement.getBoundingClientRect().top || 0) +
      16 * 4;

    setTopFilterTop(top);
  }, []);

  useLayoutEffect(calculateSegments, [dates]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const overrideFilterKey = url.searchParams.get("filter-key");
    if (overrideFilterKey) setFilterMode(overrideFilterKey);

    url.searchParams.delete("filter-key");
    window.history.replaceState(null, "", url);
  }, []);

  useEffect(() => {
    setRenderGraphKey((key) => key + 1);
  }, [topData]);

  useEffect(() => {
    var timeout: number | undefined;

    if (hoveredSegment !== undefined) {
      timeout = setTimeout(() => {
        setShowPopup(true);
      }, 1000);
    }

    setShowPopup(false);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [hoveredSegment]);

  const { longCalendarLabel, shortCalendarLabel } = (() => {
    const firstDayMonth = dates[0].getMonth();
    const lastDayMonth = dates[dates.length - 1].getMonth();

    const firstDayYear = dates[0].getFullYear();
    const lastDayYear = dates[dates.length - 1].getFullYear();

    var longCalendarLabel = "";
    var shortCalendarLabel = "";

    if (firstDayMonth === lastDayMonth) {
      longCalendarLabel = `${getMonthName(
        dates[9].getMonth()
      )} ${firstDayYear}`;
      shortCalendarLabel = `${getMonthShort(
        dates[9].getMonth()
      )} ${firstDayYear}`;
    } else {
      if (firstDayYear === lastDayYear) {
        longCalendarLabel = `${getMonthName(firstDayMonth)} - ${getMonthName(
          lastDayMonth
        )} ${firstDayYear}`;
        shortCalendarLabel = `${getMonthShort(firstDayMonth)} - ${getMonthShort(
          lastDayMonth
        )} ${firstDayYear}`;
      } else {
        longCalendarLabel = `${getMonthName(
          firstDayMonth
        )} ${firstDayYear} - ${getMonthName(lastDayMonth)} ${lastDayYear}`;
        shortCalendarLabel = `${getMonthShort(
          firstDayMonth
        )} ${firstDayYear} - ${getMonthShort(lastDayMonth)} ${lastDayYear}`;
      }
    }

    return {
      longCalendarLabel,
      shortCalendarLabel,
    };
  })();

  return (
    <div
      className="flex min-h-0 flex-1 overflow-x-hidden"
      ref={containerRef}
      key={orientation}
    >
      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-x-auto overflow-y-hidden"
        style={{
          background: `linear-gradient(180deg,rgba(247,247,247,1) 0%,rgba(247,247,247,.75) 75%,rgba(255,255,255,1) 100%)`,
        }}
        ref={scrollContainer}
      >
        <div
          className="absolute bottom-0 left-20 right-0 top-0 flex px-4 lg:px-8"
          style={{
            width: segmentsContainer.current
              ? segmentsContainer.current.clientWidth
              : 0,
          }}
        >
          {dates.map((_, i) => {
            const shouldHighlight =
              selectedDateIndex === i || hoveredSegment === i;

            return (
              <button
                className={c(
                  "flex-1 opacity-20 transition-all",
                  shouldHighlight
                    ? viewMode === "score"
                      ? "bg-[#46aae1]"
                      : "bg-[#7bdd2f]"
                    : undefined
                )}
                key={i}
              />
            );
          })}
        </div>

        {/* Desktop top filter bars: */}
        <div className="sticky left-0 right-0 top-0 z-10 hidden justify-between gap-4 p-4 text-sm lg:flex xl:p-8">
          <div
            className="flex max-w-xl flex-[3_1_0%] shrink-0 justify-between rounded-full border border-theme-border bg-white p-1 pl-1 shadow-sm"
            style={{ top: topFilterTop }}
          >
            <div className="flex shrink-0 items-center gap-2 px-2 text-center font-medium text-theme-dark-gray xl:gap-4 2xl:text-lg">
              <button className="shrink-0 p-2" onClick={previousDates}>
                <img
                  alt="left arrow"
                  className="h-3 w-3"
                  src={p("icons/arrow_gray.svg")}
                />
              </button>
              <span className="whitespace-nowrap lg:hidden xl:block">
                {longCalendarLabel}
              </span>
              <span className="hidden whitespace-nowrap lg:block xl:hidden">
                {shortCalendarLabel}
              </span>
              <button className="shrink-0 p-2" onClick={nextDates}>
                <img
                  alt="right arrow"
                  className="h-3 w-3 rotate-180"
                  src={p("icons/arrow_gray.svg")}
                />
              </button>
            </div>
            <HorizontalRadio
              className="md:gap-2 xl:gap-4 [&>*]:px-2 2xl:[&>*]:px-4"
              options={[
                { key: "score", label: "Score" },
                { key: "improvement", label: "Improvement" },
              ]}
              selectedOption={viewMode}
              onOptionChange={(mode) => setViewMode(mode as ViewMode)}
            />
          </div>
          <div className="flex max-w-md flex-[2_1_0%] items-center justify-between gap-2 rounded-full border border-theme-border bg-white px-4 py-2 shadow-sm">
            <span className="font-medium text-theme-dark-gray">
              Filter<span className="hidden xl:inline-block">&nbsp;by</span>:
            </span>
            <Dropdown
              className="flex-1"
              options={[
                { key: "all", label: "Showing All" },
                ...datesPerformance.available_activities.map((activity) => ({
                  key: `activity-${activity.id}-${activity.name}`,
                  label: `${activity.short_name || activity.name} (Activity)`,
                })),
                ...datesPerformance.available_skills.map((skill) => ({
                  key: `skill-${skill.id}-${skill.name}`,
                  label: `${skill.name} (Skill)`,
                })),
              ]}
              selected={filterMode}
              onOptionChange={setFilterMode}
            />
          </div>
        </div>

        {/* Mobile top filter bar: */}
        <div className="sticky left-0 right-0 top-0 p-4 lg:hidden">
          <div
            className="flex h-[56px] justify-between gap-4 rounded-full border border-theme-border bg-white p-1 pl-1 text-sm shadow-sm"
            style={{ top: topFilterTop }}
          >
            <div className="flex items-center gap-2 px-2 text-center font-medium text-theme-dark-gray sm:gap-4 lg:text-lg">
              <button className="shrink-0 p-2" onClick={previousDates}>
                <img
                  alt="left arrow"
                  className="h-3 w-3"
                  src={p("icons/arrow_gray.svg")}
                />
              </button>
              <span className="hidden whitespace-nowrap sm:block">
                {longCalendarLabel}
              </span>
              <span className="whitespace-nowrap sm:hidden">
                {shortCalendarLabel}
              </span>
              <button className="shrink-0 p-2" onClick={nextDates}>
                <img
                  alt="right arrow"
                  className="h-3 w-3 rotate-180"
                  src={p("icons/arrow_gray.svg")}
                />
              </button>
            </div>
            <HorizontalRadio
              options={[
                {
                  key: "score",
                  label: "Score",
                },
                {
                  key: "improvement",
                  label: (
                    <>
                      <span className="hidden sm:inline-block">
                        Improvement
                      </span>
                      <span className="inline-block sm:hidden">Imp.</span>
                    </>
                  ),
                },
              ]}
              selectedOption={viewMode}
              onOptionChange={(mode) => setViewMode(mode as ViewMode)}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="relative flex min-w-[1300px] flex-1 flex-col px-4 lg:px-8 lg:pb-12">
          {/* Top graph: */}
          <div className="flex flex-[3_1_0%] flex-col gap-4 sm:gap-8">
            <div className="flex flex-1 gap-2">
              <div className="flex w-[4.5rem] shrink-0 items-center justify-between text-xs text-[#9e9e9e]">
                <div className="flex h-full flex-col justify-between border-r border-theme-border pr-2">
                  {topDataAxis.map((n, i) => (
                    <span
                      className={c(
                        "text-right",
                        i % 2 !== 0 && "hidden xl:inline-block"
                      )}
                      key={n}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-center">
                {noImprovement || noScore ? (
                  <span className="font-semibold text-[#c6c6c6]">
                    {noImprovement && "No Improvement"}
                    {noScore && "Insufficient Data"}
                  </span>
                ) : (
                  <ResponsiveContainer>
                    <LineChart
                      data={topData}
                      margin={{
                        top: 12,
                        right: segmentWidth / 2,
                        bottom: 12,
                        left: segmentWidth / 2,
                      }}
                      key={renderGraphKey}
                    >
                      <YAxis hide={true} domain={topDataDomain} />
                      <Line
                        dataKey={"data"}
                        stroke={accentColor}
                        strokeWidth={2}
                        dot={(props) => {
                          const { cx, cy, index } = props;

                          return (
                            <circle
                              r={selectedDateIndex === index ? "10" : "6"}
                              stroke="#fff"
                              strokeWidth="2"
                              fill={accentColor}
                              cx={cx}
                              cy={cy}
                              key={index}
                            ></circle>
                          );
                        }}
                      ></Line>
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <span className="w-[4.5rem] rounded-full border border-theme-border bg-white py-1 text-center text-xs font-medium text-theme-dark-gray shadow-sm lg:text-sm">
              {viewMode === "score" ? "Score" : "Imp."}{" "}
              <span className="font-inter text-2xs font-bold text-[#ccc]">
                {viewMode === "improvement" && "+"}%
              </span>
            </span>
          </div>

          <div className="my-1 h-[1px] bg-theme-border font-bold sm:my-3" />

          {/* Bottom graph: */}
          <div className="flex flex-[2_1_0%] flex-col gap-4 sm:gap-8">
            <span className="w-[4.5rem] rounded-full border border-theme-border bg-white py-1 text-center text-xs font-medium text-theme-dark-gray shadow-sm lg:text-sm">
              Time <span className="font-inter text-2xs text-[#ccc]">Hrs</span>
            </span>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-1 gap-2">
                <div className="flex w-[4.5rem] shrink-0 items-center justify-between text-xs text-[#9e9e9e]">
                  <div className="flex h-full flex-col justify-between border-r border-theme-border pr-2">
                    {bottomDataAxis.map((n) => (
                      <span className="text-right" key={n}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <ResponsiveContainer>
                    <BarChart
                      data={bottomData}
                      margin={{ top: 1, right: 0, bottom: 1, left: 0 }}
                      barGap={16}
                    >
                      <YAxis hide={true} domain={bottomDataDomain} />
                      <Bar dataKey="time" stroke={accentColor}></Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-[4.5rem] shrink-0 " />
                <div className="flex min-w-0 flex-1 border-t border-theme-border pt-1 text-xs text-[#9e9e9e] sm:pt-3">
                  {dates.map((date, i) => {
                    return (
                      <span
                        className={c(
                          "flex-1 text-center",
                          isSameDate(date, new Date()) &&
                            "font-semibold text-[#646464]",
                          isSameDate(date, selectedDate) && "font-semibold",
                          isSameDate(date, selectedDate) &&
                            (viewMode === "score"
                              ? "text-[#46aae1]"
                              : "text-[#5fcc19]")
                        )}
                        style={{ width: segmentWidth }}
                        key={date.getTime()}
                      >
                        {prefix(date.getDate())}.{prefix(date.getMonth() + 1)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-0 left-20 right-0 top-0 flex px-4 lg:px-8"
            ref={segmentsContainer}
          >
            {dates.map((date, i) => {
              return (
                <button
                  className="flex-1"
                  onClick={() => {
                    setSelectedDate(date);

                    setSidebarOpen(true);
                  }}
                  onMouseOver={() => {
                    setHoveredSegment(i);
                  }}
                  onMouseOut={() => {
                    setHoveredSegment(undefined);
                  }}
                  key={i}
                />
              );
            })}

            <div
              className={c(
                "absolute top-1/2 w-64 -translate-x-1/2 -translate-y-1/2 rounded-md border border-theme-border bg-white shadow-sm transition",
                showPopup ? "z-10 opacity-100" : "-z-10 opacity-0"
              )}
              style={{
                left:
                  (hoveredSegment !== undefined ? hoveredSegment : -99999) *
                  segmentWidth,
              }}
            >
              <span className="block border-b border-theme-border px-4 py-2 font-medium text-theme-extra-dark-gray">
                {hoveredSegment !== undefined &&
                  getDatePreview(dates[hoveredSegment].getTime())}
              </span>
              <div className="flex justify-between px-4 py-1 pt-2 font-semibold text-theme-medium-gray">
                <span>Score:</span>
                <span>
                  <span style={{ color: accentColor }}>
                    {hoveredSegment !== undefined &&
                      topData[hoveredSegment].score}
                  </span>{" "}
                  <span className="text-2xs text-theme-light-gray">%</span>
                </span>
              </div>
              <div className="flex justify-between px-4 py-1 font-semibold text-theme-medium-gray">
                <span>Improvement:</span>
                <span>
                  <span style={{ color: accentColor }}>
                    {hoveredSegment !== undefined &&
                    (topData[hoveredSegment].improvement || 0) >= 0
                      ? "+"
                      : "-"}
                    {hoveredSegment !== undefined &&
                      getFloatString(topData[hoveredSegment].improvement || 0)}
                  </span>{" "}
                  <span className="text-2xs text-theme-light-gray">%</span>
                </span>
              </div>
              <div className="flex justify-between px-4 py-1 pb-2 font-semibold text-theme-medium-gray">
                <span>Time:</span>
                <span>
                  <span style={{ color: accentColor }}>
                    {hoveredSegment !== undefined &&
                      destructTime(bottomData[hoveredSegment].time || 0)
                        .hours}{" "}
                  </span>{" "}
                  <span className="text-2xs text-theme-light-gray">hours</span>{" "}
                  <span style={{ color: accentColor }}>
                    {hoveredSegment !== undefined &&
                      destructTime(bottomData[hoveredSegment].time || 0)
                        .minutes}{" "}
                  </span>{" "}
                  <span className="text-2xs text-theme-light-gray">mins</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile bottom filter bar: */}
        <div className="sticky left-0 right-0 top-0 p-4 lg:hidden">
          <div className="flex items-center justify-between gap-2 rounded-full border border-theme-border bg-white px-4 py-2 text-sm shadow-sm">
            <span className="font-medium text-theme-dark-gray">Filter by:</span>
            <Dropdown
              className="flex-1 lg:w-72"
              options={[
                { key: "all", label: "Showing All" },
                ...datesPerformance.available_activities.map((activity) => ({
                  key: `activity-${activity.id}-${activity.name}`,
                  label: `${activity.short_name || activity.name} (Activity)`,
                })),
                ...datesPerformance.available_skills.map((skill) => ({
                  key: `skill-${skill.id}-${skill.name}`,
                  label: `${skill.name} (Skill)`,
                })),
              ]}
              selected={filterMode}
              onOptionChange={setFilterMode}
              dir="up"
            />
          </div>
        </div>
      </div>
      <PerformanceDaybydaySidebar
        className={c(
          "sticky left-0 right-0 top-0 z-20 min-h-full shrink-0 w-full overflow-y-auto transition-all lg:bottom-0 lg:min-w-[300px]",
          sidebarOpen
            ? "min-w-full translate-x-0 lg:w-[27.5%]"
            : "min-w-0 translate-x-full lg:w-0 lg:translate-x-0"
        )}
        closeSidebar={() => {
          setSidebarOpen(false);
          setSelectedDate(undefined);
        }}
        performance={selectedPerformance}
        nextDate={() => {
          if (selectedDate === undefined) return;

          if (selectedDateIndex === SEGMENTS_PER_VIEW - 1) {
            nextDates();

            const nextDate = new Date(dates[selectedDateIndex]);
            nextDate.setDate(nextDate.getDate() + 1);

            setSelectedDate(nextDate);
          } else setSelectedDate(dates[selectedDateIndex + 1]);
        }}
        prevDate={() => {
          if (selectedDate === undefined) return;

          if (selectedDateIndex === 0) {
            previousDates();

            const nextDate = new Date(dates[selectedDateIndex]);
            nextDate.setDate(nextDate.getDate() - 1);

            setSelectedDate(nextDate);
          } else setSelectedDate(dates[selectedDateIndex - 1]);
        }}
        filterMode={filterMode}
        setGlobalFilterMode={setFilterMode}
        onTransitionEnd={calculateSegments}
      />
    </div>
  );

  function nextDates() {
    const newPivotDate = new Date(pivotDate.getTime());

    newPivotDate.setDate(newPivotDate.getDate() + SEGMENTS_PER_VIEW);

    setPivotDate(newPivotDate);
  }

  function previousDates() {
    const newPivotDate = new Date(pivotDate.getTime());

    newPivotDate.setDate(newPivotDate.getDate() - SEGMENTS_PER_VIEW);

    setPivotDate(newPivotDate);
  }

  function calculateSegments() {
    if (!scrollContainer.current) return;

    const segmentWidth =
      scrollContainer.current.scrollWidth / SEGMENTS_PER_VIEW;

    setSegmentWidth(segmentWidth);
  }
};

export default PerformanceDaybydayTab;

interface PerformanceDaybydaySidebarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  closeSidebar: () => void;
  performance: DatePeformance | undefined;
  nextDate: () => void;
  prevDate: () => void;
  filterMode: string;
  setGlobalFilterMode: (mode: string) => void;
}

const PerformanceDaybydaySidebar: React.FC<PerformanceDaybydaySidebarProps> = ({
  closeSidebar,
  performance,
  nextDate,
  prevDate,
  filterMode: globalFilterMode,
  setGlobalFilterMode,
  ...rest
}) => {
  const tabbarContainerRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<SidebarViewMode>("statistics");
  const [filterMode, setFilderMode] = useState<"activity" | "skill">(
    "activity"
  );

  const [activatedWidth, setActivatedWidth] = useState(0);
  const [activatedLeft, setActivatedLeft] = useState(0);

  useLayoutEffect(() => {
    if (!tabbarContainerRef.current) return;

    const activatedElement =
      tabbarContainerRef.current.querySelector(".activated");

    if (!activatedElement) return;

    const left =
      activatedElement.getBoundingClientRect().left -
      tabbarContainerRef.current.getBoundingClientRect().left;

    setActivatedWidth(activatedElement.clientWidth);
    setActivatedLeft(left);
  }, [closeSidebar, viewMode]);

  if (!performance) return null;

  return (
    <div
      {...rest}
      className={c(
        "flex flex-col overflow-x-hidden border-l border-theme-border bg-white",
        rest.className
      )}
    >
      <div className="flex bg-[#34424c] font-light text-white">
        <button
          className="bg-[#2c3841] px-4 py-2 lg:hidden"
          onClick={closeSidebar}
        >
          <img alt="close" className="h-3 w-3" src={p("icons/close.svg")} />
        </button>
        <div className="z-30 flex flex-1 items-center justify-center gap-4 whitespace-nowrap py-3 !text-base font-medium lg:!text-sm xl:!text-base">
          <button className="p-2" onClick={prevDate}>
            <img
              alt="left arrow"
              className="h-[9px] w-[9px] opacity-40"
              src={p("icons/arrow.svg")}
            />
          </button>
          <span className="mt-[1px] hidden sm:block">
            {getDatePreview(performance.date.getTime())}
          </span>
          <span className="mt-[1px] sm:hidden">
            {getSmallDatePreview(performance.date.getTime())}
          </span>
          <button className="p-2" onClick={nextDate}>
            <img
              alt="right arrow"
              className="h-[9px] w-[9px] rotate-180 opacity-40"
              src={p("icons/arrow.svg")}
            />
          </button>
        </div>
      </div>
      <div className="flex border-b border-theme-border">
        <div className="flex w-1/2 shrink-0 items-center justify-center border-r border-theme-border px-8 py-6">
          <ScorePie
            score={performance.score}
            median="neutral"
            className="h-[130px] w-[130px] shrink-0 [&_.score-text]:mt-2 sm:[&_.score-text]:!text-[48px] lg:[&_.score-text]:!text-[42px] xl:[&_.score-text]:!text-[48px]"
            fontSize={48}
            planeSize="small"
            lineHeight="55px"
          />
        </div>
        <div className="flex flex-1 shrink-0 flex-col">
          <div className="flex flex-1 items-end border-b border-theme-border p-2">
            <div className="flex h-full flex-col justify-between gap-4">
              <span className="text-sm text-theme-dark-gray">Improvement</span>
              {performance.improvement_rate !== null ? (
                <span className="text-2xl text-theme-dark-gray">
                  {getFloatString(performance.improvement_rate)}
                  <span className="ml-1 text-xs font-light text-theme-light-gray">
                    %
                  </span>
                </span>
              ) : (
                <span className="text-theme-light-gray">No Data</span>
              )}
            </div>
            {performance.improvement_rate !== null && (
              <ImprovementGraph
                improvementRate={performance.improvement_rate}
                height="60%"
              />
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between gap-4 p-2">
            <span className="text-sm text-theme-dark-gray">Time</span>
            {performance.total_duration !== null ? (
              <span className="text-2xl text-theme-dark-gray">
                <span>
                  {Math.floor(performance.total_duration / 3600)}
                  <span className="ml-1 text-xs font-light text-theme-light-gray">
                    hours
                  </span>
                </span>
                <span className="ml-2">
                  {Math.floor((performance.total_duration % 3600) / 60)}
                  <span className="ml-1 text-xs font-light text-theme-light-gray">
                    mins
                  </span>
                </span>
              </span>
            ) : (
              <span className="text-theme-light-gray">No Data</span>
            )}
          </div>
        </div>
      </div>
      <div className="relative flex font-inter" ref={tabbarContainerRef}>
        {[
          { key: "statistics", label: "Your Statistics" },
          { key: "activity", label: "Your Activity" },
        ].map((tab) => {
          const active = viewMode === tab.key;

          return (
            <button
              className={c(
                "flex-1 bg-white py-2 text-[15px] font-semibold lg:text-sm xl:text-[15px]",
                active
                  ? "activated text-theme-extra-dark-gray"
                  : "text-theme-light-gray transition hover:brightness-95"
              )}
              onClick={() => setViewMode(tab.key as SidebarViewMode)}
              key={tab.key}
            >
              {tab.label}
            </button>
          );
        })}
        <div className="absolute top-full z-10 h-[2px] w-full bg-theme-border">
          <div
            className={c("absolute h-full bg-[#3793d1] transition-all")}
            style={{ width: activatedWidth, left: activatedLeft }}
          />
        </div>
      </div>
      {viewMode === "statistics" ? (
        <div className="flex flex-1 flex-col gap-4 bg-[#f2f2f2] p-4 scrollbar-track-transparent scrollbar-thumb-black/10 lg:min-h-0 lg:basis-0 lg:overflow-y-auto lg:scrollbar-thin">
          {globalFilterMode === "all" ? (
            <HorizontalRadio
              className="mx-auto self-start text-sm"
              options={[
                { key: "activity", label: "Activity" },
                { key: "skill", label: "Skill" },
              ]}
              selectedOption={filterMode}
              onOptionChange={(mode) =>
                setFilderMode(mode as "activity" | "skill")
              }
            />
          ) : (
            <div className="flex min-w-[5rem] justify-between gap-2 self-start rounded-full bg-theme-medium-gray px-4 py-[6px] text-white">
              {globalFilterMode.split("-")[2]}
              {globalFilterMode.split("-")[0] === "skill" && (
                <span className="opacity-50">Skill</span>
              )}
              <button
                className="mt-[2px]"
                onClick={() => setGlobalFilterMode("all")}
              >
                <img
                  alt="close icon"
                  className="h-2 w-2 opacity-50"
                  src={p("icons/close.svg")}
                />
              </button>
            </div>
          )}
          <div className="flex flex-1 flex-col gap-8">
            <TimeBreakdownCard
              breakdown={performance.time_breakdown}
              breakdown_components={performance.time_breakdown_components}
              totalDuration={performance.total_duration || 0}
              filterMode={filterMode}
              setGlobalFilterMode={setGlobalFilterMode}
            />
            <ImprovementBreakdownCard
              improvement_components={
                performance.improvement_breakdown_components
              }
              filterMode={filterMode}
              setGlobalFilterMode={setGlobalFilterMode}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-6 bg-[#f2f2f2] p-4 scrollbar-track-transparent scrollbar-thumb-black/10 lg:min-h-0 lg:basis-0 lg:overflow-y-auto lg:scrollbar-thin">
          {performance.activity.map((activity) => {
            if (activity.activity_type === "result")
              return (
                <ResultTag result={activity} key={`result-${activity.id}`} />
              );
            else
              return (
                <TargetTag target={activity} key={`target-${activity.id}`} />
              );
          })}
        </div>
      )}
    </div>
  );
};

interface TimeBreakdownCardProps extends React.HTMLAttributes<HTMLDivElement> {
  breakdown: number[];
  breakdown_components: {
    activities: TimeBreakdownComponent[];
    skills: TimeBreakdownComponent[];
  };
  totalDuration: number;
  filterMode: "activity" | "skill";
  setGlobalFilterMode: (mode: string) => void;
}

const TimeBreakdownCard: React.FC<TimeBreakdownCardProps> = ({
  totalDuration,
  breakdown,
  breakdown_components,
  filterMode,
  setGlobalFilterMode,
  ...rest
}) => {
  const timeData = useMemo(() => {
    return [
      {
        label: "12am-4am",
        time: breakdown[0],
      },
      {
        label: "4am-8am",
        time: breakdown[1],
      },
      {
        label: "8am-12pm",
        time: breakdown[2],
      },
      {
        label: "12pm-4pm",
        time: breakdown[3],
      },
      {
        label: "4pm-8pm",
        time: breakdown[4],
      },
      {
        label: "8pm-12am",
        time: breakdown[5],
      },
    ];
  }, [breakdown]);

  return (
    <div
      {...rest}
      className={c(
        "flex flex-col rounded-sm border border-theme-border bg-white shadow-sm",
        rest.className
      )}
    >
      <span className="border-b border-theme-border p-3 font-semibold text-[#646464]">
        Time Breakdown
      </span>
      <div className="relative flex h-[135px] items-end">
        <ResponsiveContainer height="70%">
          <BarChart
            data={timeData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <Bar dataKey="time" fill="#cbecfb"></Bar>
          </BarChart>
        </ResponsiveContainer>
        <div
          className="absolute bottom-0 left-0 right-0 top-0 flex"
          style={{ boxShadow: "inset 0px -11px 20px -7px rgba(0,0,0,0.075)" }}
        >
          {timeData.map((d, i) => (
            <div
              className={c(
                "flex-1 pt-2 text-center text-3xs text-theme-light-gray",
                i !== timeData.length - 1 && "border-r border-theme-border"
              )}
              key={d.label}
            >
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-8 border-t border-theme-border px-3 py-4">
        {(filterMode === "activity"
          ? breakdown_components.activities
          : breakdown_components.skills
        ).map((component) => (
          <TimeProgressBar
            name={component.name}
            time={component.time}
            progress={(component.time / totalDuration) * 100}
            onClick={() =>
              setGlobalFilterMode(
                `${filterMode}-${component.component_id}-${component.name}`
              )
            }
            key={component.component_id}
          />
        ))}
      </div>
    </div>
  );
};

interface TimeProgressBarProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  time: number;
  progress: number;
}

const TimeProgressBar: React.FC<TimeProgressBarProps> = ({
  name,
  time,
  progress,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={c(
        "group flex cursor-pointer items-center gap-4",
        rest.className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate font-inter !text-base font-semibold text-theme-extra-dark-gray lg:!text-sm xl:!text-base">
            {name}
          </span>
          <span className="whitespace-nowrap text-[0.85rem]">
            <span className="text-base text-theme-dark-gray">
              {destructTime(time).hours}
            </span>{" "}
            hours{" "}
            <span className="text-base text-theme-dark-gray">
              {destructTime(time).minutes}
            </span>{" "}
            mins
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[#f2f2f2]">
          <div
            className="h-full bg-[#4f5b63]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-theme-light-gray group-hover:bg-theme-blue">
        <img
          alt="daybyday white"
          className="h-2 w-2"
          src={p("icons/daybyday_white.svg")}
        />
      </div>
    </button>
  );
};

interface ImprovementBreakdownCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  improvement_components: {
    activities: ImprovementBreakdownComponent[];
    skills: ImprovementBreakdownComponent[];
  };
  filterMode: "activity" | "skill";
  setGlobalFilterMode: (mode: string) => void;
}

const ImprovementBreakdownCard: React.FC<ImprovementBreakdownCardProps> = ({
  improvement_components,
  filterMode,
  setGlobalFilterMode,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        "flex flex-col rounded-sm border border-theme-border bg-white shadow-sm",
        rest.className
      )}
    >
      <span className="border-b border-theme-border p-3 font-semibold text-[#646464]">
        Improvement Breakdown
      </span>
      <div className="flex flex-col gap-8 px-3 py-4">
        {(filterMode === "activity"
          ? improvement_components.activities
          : improvement_components.skills
        ).map((component) => (
          <ImprovementProgressBar
            name={component.name}
            segments={component.score_segments}
            onClick={() =>
              setGlobalFilterMode(
                `${filterMode}-${component.component_id}-${component.name}`
              )
            }
            key={component.component_id}
          />
        ))}
      </div>
    </div>
  );
};

interface ImprovementProgressBarProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  segments: number[];
}

const ImprovementProgressBar: React.FC<ImprovementProgressBarProps> = ({
  name,
  segments,
  ...rest
}) => {
  const improvement = Math.ceil(
    ((segments[1] - segments[0]) / segments[0]) * 100
  );

  if (improvement <= 0) return null;

  return (
    <button
      {...rest}
      className={c(
        "group flex cursor-pointer items-center gap-4",
        rest.className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="truncate font-inter !text-base font-semibold text-theme-extra-dark-gray lg:!text-sm xl:!text-base">
            {name}
          </span>
          {segments[0] > 0 && (
            <span className="text-base text-theme-dark-gray">
              {improvement > 0 ? "+" : improvement < 0 && "-"}{" "}
              {Math.abs(improvement)}{" "}
              <span className="text-[0.85rem] text-theme-light-gray">%</span>
            </span>
          )}
        </div>
        <ProgressBar stages={segments} showLabels={false} showCircles={false} />
      </div>
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-theme-light-gray group-hover:bg-theme-blue">
        <img
          alt="daybyday white"
          className="h-2 w-2"
          src={p("icons/daybyday_white.svg")}
        />
      </div>
    </button>
  );
};

interface TargetTagProps extends React.HTMLAttributes<HTMLDivElement> {
  target: Target;
}

const TargetTag: React.FC<TargetTagProps> = ({ target, ...rest }) => {
  const { label, icon, color } = (() => {
    switch (target.status) {
      case "achieved":
        return {
          label: "Target Achieved",
          icon: "target_achieved.svg",
          color: "#74d813",
        };
      case "future-expire":
        return {
          label: "Target Expiry",
          icon: "target_expiry.svg",
          color: "#ebb660",
        };
      case "missed":
        return {
          label: "Target Missed",
          icon: "target_expired.svg",
          color: "#fc5656",
        };
      case "set":
        return {
          label: "Target Set",
          icon: "target_set.svg",
          color: "#0d94c5",
        };
    }
  })();

  const desc1 = (() => {
    switch (target.type) {
      case "improvement":
        return `Achieve Improvement of ${target.figure}% in ${target.name}`;
      case "score":
        return `Achieve Score of ${target.figure}% in ${target.name}`;
      case "time":
        return `Achieve time of ${target.figure} hour${
          target.figure > 1 ? "s" : ""
        } in ${target.name}`;
    }
  })();

  const desc2 = (() => {
    switch (target.status) {
      case "set":
        return `by ${getTimePreview(target.end_time.getTime())}`;
      case "achieved":
        return `achieved today at ${prefix(target.time.getHours())}:${prefix(
          target.time.getMinutes()
        )}`;
      case "missed":
        return `missed today at ${prefix(target.time.getHours())}:${prefix(
          target.time.getMinutes()
        )}`;
      case "future-expire":
        return `expires at ${prefix(target.time.getHours())}:${prefix(
          target.time.getMinutes()
        )}`;
    }
  })();

  const startTime = (() => {
    return `${prefix(target.start_time.getHours())}:${prefix(
      target.start_time.getMinutes()
    )}`;
  })();

  return (
    <div {...rest}>
      <span className="mb-1 block text-[15px] tracking-wide text-[#c6c6c6]">
        {startTime}
      </span>
      <div className="relative flex h-24 shrink-0 items-center gap-2 overflow-hidden rounded-md border border-theme-border bg-white px-3 py-2 text-sm shadow-sm">
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
          <span className="font-inter !text-[15px] !font-semibold text-[#777777]">
            {label}
          </span>
          <span className="!text-[13px] !font-normal text-[#999]">
            {desc1} <span className="font-semibold text-[#666]">{desc2}</span>.
          </span>
        </div>
      </div>
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
      case "above":
        return "#74d813";
      case "average":
        return "#0d94c5";
      case "below":
        return "#fc5656";
    }
  })();

  const { startTime, endTime } = (() => {
    return {
      startTime: `${prefix(result.from.getHours())}:${prefix(
        result.from.getMinutes()
      )}`,
      endTime: `${prefix(result.to.getHours())}:${prefix(
        result.to.getMinutes()
      )}`,
    };
  })();

  return (
    <div {...rest}>
      <span className="mb-1 block text-[15px] tracking-wide text-[#c6c6c6]">
        {startTime} to {endTime}
      </span>
      <div
        className="relative flex h-24 shrink-0 cursor-pointer gap-4 overflow-hidden rounded-md border border-theme-border bg-white text-sm shadow-sm lg:h-24"
        onClick={() => window.location.replace(result.hyperlink)}
        ref={containerRef}
      >
        {result.mode === "training" && (
          <div className="absolute bottom-0 h-[3px] w-full bg-theme-green" />
        )}
        <img
          alt="activity thumbnail"
          className="relative h-full shrink-0 border-r border-r-[#ccc]"
          style={{ width: imageWidth }}
          src={result.image}
        />
        <div className="flex flex-1 flex-col justify-center gap-3 py-2 pr-4 sm:flex-row sm:items-center sm:justify-between sm:gap-1 lg:flex-col lg:items-stretch lg:justify-center 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div className="flex min-w-0 flex-col gap-1 xl:gap-3 truncate">
            <div className="flex items-center gap-2">
              <span className="block truncate font-inter !text-base !font-semibold text-[#777777]">
                <span className="hidden sm:inline-block lg:hidden xl:inline-block">
                  {result.name}
                </span>
                <span className="truncate sm:hidden lg:inline-block xl:hidden">
                  {result.short_name || result.name}
                </span>
              </span>
              {result.mode === "training" && result.high_score && (
                <img
                  alt="training mode icon"
                  className="h-6 w-6 lg:hidden 2xl:block"
                  src={p("icons/mortarboard_green.svg")}
                />
              )}
              {result.mode === "training" && result.high_score && (
                <img
                  alt="training mode icon"
                  className="-transalte-x-1/2 absolute right-2 top-2 hidden h-12 w-12 -translate-y-1/2 -rotate-[35deg] lg:block 2xl:hidden"
                  src={p("icons/mortarboard_green.svg")}
                />
              )}
            </div>
            {result.mode === "training" && !result.high_score && (
              <div className="flex items-center gap-1 text-xs font-semibold text-theme-green">
                <img
                  alt="training mode icon"
                  className="h-4 w-4"
                  src={p("icons/mortarboard_green.svg")}
                />
                <span>Training Mode</span>
              </div>
            )}
            {result.high_score && (
              <div className="hidden items-center gap-2 self-start whitespace-nowrap rounded-[6px] border border-[#98cdf1] bg-[#a1daff59] px-[10px] py-[6px] font-inter text-[13px] font-semibold text-[#509ffff0] sm:flex lg:hidden 2xl:flex">
                <img
                  alt="star icon"
                  className="h-4 w-4"
                  src={p("icons/star_blue.svg")}
                />
                <span className="mt-[1px]">New High Score!</span>
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center justify-between">
            <span className="block !text-[15px] font-semibold text-[#b2b2b2]">
              <span style={{ color: gradeColor }}>{result.score}</span>{" "}
              <span className="text-sm font-normal">out of</span>{" "}
              <span className="text-[#888]">100</span>
            </span>
            {result.high_score && (
              <div className="rounded-full border border-[#98cdf1] bg-[#a1daff59] p-[4px] sm:hidden lg:block 2xl:hidden">
                <img
                  alt="star icon"
                  className="h-3 w-3"
                  src={p("icons/star_blue.svg")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
