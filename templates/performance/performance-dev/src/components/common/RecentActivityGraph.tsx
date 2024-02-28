import { useMemo, useState } from 'react';
import { c } from '../../lib';

interface RecentActivityGraphProps
  extends React.HTMLAttributes<HTMLDivElement> {
  figures: { date: Date; score: number }[] | null;
}

const RecentActivityGraph: React.FC<RecentActivityGraphProps> = ({
  figures,
  ...rest
}) => {
  const [selectedFigureIndex, setSelctedFigureIndex] = useState<
    number | undefined
  >(undefined);

  const orderedFigures = useMemo(() => {
    if (!figures) return null;

    return figures.sort((f1, f2) => f1.date.getTime() - f2.date.getTime());
  }, [figures]);

  const selectedFigure =
    orderedFigures !== null && selectedFigureIndex !== undefined
      ? orderedFigures[selectedFigureIndex]
      : undefined;

  return (
    <div
      {...rest}
      className={c('flex w-full flex-col gap-8 bg-white pt-3', rest.className)}
    >
      <div className="flex justify-between whitespace-nowrap px-4">
        <span className="text-sm text-theme-dark-gray">Recent Activity</span>
        {selectedFigure && (
          <span className="font-semibold text-theme-dark-blue sm:text-center">
            {selectedFigure.score}%{' '}
            <span className="font-light text-theme-light-gray">
              on {getDateLabel(selectedFigure.date)}
            </span>
          </span>
        )}
      </div>
      <div className="flex w-full flex-1 items-end gap-1 px-1">
        {orderedFigures !== null ? (
          orderedFigures.map((figure, i) => {
            const key = figure.date.getTime();

            return (
              <div
                className="flex-1 cursor-pointer bg-[#cbecfb] transition hover:bg-theme-dark-blue"
                style={{ height: `${figure.score}%` }}
                onClick={() => setSelctedFigureIndex(i)}
                onMouseOver={() => setSelctedFigureIndex(i)}
                onMouseOut={() => setSelctedFigureIndex(undefined)}
                key={key}
              />
            );
          })
        ) : (
          <span className="mx-auto my-auto text-lg text-theme-light-gray">
            Insufficient Data
          </span>
        )}
      </div>
    </div>
  );

  function getDateLabel(date: Date) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return `${months[date.getMonth()]} ${date.getDate()}`;
  }
};

export default RecentActivityGraph;
