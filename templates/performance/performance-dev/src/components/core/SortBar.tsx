import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { c, p } from '../../lib';
import type { SortType } from '../../types';

interface Sort {
  key: SortType;
  label: React.ReactNode;
}
interface SortBarProps extends React.HTMLAttributes<HTMLDivElement> {
  sorts: Sort[];
  selectedSort: SortType;
  setSelectedSort: (sort: SortType) => void;
  overrideMobile?: boolean;
}

const SortBar: React.FC<SortBarProps> = ({
  sorts,
  selectedSort,
  setSelectedSort,
  overrideMobile = false,
  ...rest
}) => {
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const [activatedButtonWidth, setActivatedButtonWidth] = useState(0);
  const [activatedButtonLeft, setActivatedButtonLeft] = useState(0);

  useLayoutEffect(() => {
    if (!buttonsContainerRef.current) return;

    const activatedButton = buttonsContainerRef.current.querySelector(
      '#activated-sort-button'
    );

    if (!activatedButton) return;

    const left =
      activatedButton.getBoundingClientRect().left -
      buttonsContainerRef.current.getBoundingClientRect().left;

    setActivatedButtonWidth(activatedButton.clientWidth);
    setActivatedButtonLeft(left);
  }, [selectedSort]);

  const showMobileVersion = overrideMobile;

  const sortedSorts = useMemo(() => {
    if (!showMobileVersion) return sorts;
    else
      return [...sorts].sort((s1) => {
        if (s1.key === selectedSort) return -1;
        else return 1;
      });
  }, [sorts, showMobileVersion, selectedSort]);

  if (showMobileVersion)
    return (
      <div
        {...rest}
        className={c(
          'flex items-center gap-1 rounded-full border border-theme-border bg-[#ededed] py-1 pl-3 pr-1 text-sm md:gap-4 md:pl-4',
          rest.className
        )}
      >
        {/* <span className="text-[#707070]">Sort by:</span> */}
        <img src={p('icons/filter.svg')} className="w-5" alt="filter" />
        <div
          className="relative flex flex-1 justify-between gap-2"
          ref={buttonsContainerRef}
        >
          {sortedSorts.map((sort, i) => {
            if (i > 0) return undefined;

            const activated = sort.key === selectedSort;

            return (
              <button
                className={c(
                  'sort-option relative flex-1 rounded-full bg-[#34424c] px-2 py-1 transition hover:brightness-110 md:px-4 md:py-2',
                  activated
                    ? 'text-white'
                    : 'bg-[#ededed] text-[#bfbfbf] hover:brightness-90',
                  i > 0 && 'hidden md:inline-block'
                )}
                id={activated ? 'activated-sort-button' : undefined}
                onClick={() => {
                  const currentSortIndex = sorts.findIndex(
                    (s) => s.key === selectedSort
                  );

                  console.log(sorts);

                  if (currentSortIndex === sorts.length - 1)
                    setSelectedSort(sorts[0].key);
                  else setSelectedSort(sorts[currentSortIndex + 1].key);
                }}
                key={sort.key}
              >
                {sort.label}
              </button>
            );
          })}
        </div>
        <select
          className="absolute h-0 w-0 opacity-0"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value as SortType)}
          ref={selectRef}
        >
          {sorts.map((sort) => (
            <option value={sort.key} key={sort.key}>
              {sort.label}
            </option>
          ))}
        </select>
      </div>
    );

  return (
    <div
      {...rest}
      className={c(
        'flex h-[46px] items-center gap-1 rounded-full border border-theme-border bg-[#ededed] py-1 pl-3 pr-1 text-sm md:gap-4 md:pl-4',
        rest.className
      )}
    >
      {/* <span className="text-[#707070]">Sort by:</span> */}
      <img src={p('icons/filter.svg')} className="w-5" alt="filter" />
      <div
        className="relative flex flex-1 justify-between gap-2"
        ref={buttonsContainerRef}
      >
        <div
          className="absolute bottom-0 top-0 rounded-full bg-[#34424c] transition-all"
          style={{ width: activatedButtonWidth, left: activatedButtonLeft }}
        />
        {sortedSorts.map((sort, i) => {
          const activated = sort.key === selectedSort;

          return (
            <button
              className={c(
                'relative rounded-full px-3 py-2 transition',
                activated
                  ? 'text-white'
                  : 'bg-[#ededed] text-[#bfbfbf] hover:brightness-90',
                i > 0 && 'hidden md:inline-block'
              )}
              id={activated ? 'activated-sort-button' : undefined}
              onClick={() => setSelectedSort(sort.key)}
              key={sort.key}
            >
              {sort.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortBar;
