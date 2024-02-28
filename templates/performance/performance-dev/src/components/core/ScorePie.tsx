import { useEffect, useRef, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { c, p } from '../../lib';
import type { Median } from '../../types';

interface ScorePieProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number | null;
  median: Median | null;
  precentage?: boolean;
  showPlane?: boolean;
  planeSize?: 'big' | 'small';
  fontSize?: number | string;
  innerRadius?: string;
  lineHeight?: number | string;
}

const ScorePie: React.FC<ScorePieProps> = ({
  score,
  median,
  precentage = true,
  showPlane = true,
  planeSize = 'big',
  fontSize,
  innerRadius,
  lineHeight,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);

    return () => clearTimeout(timeout);
  }, []);

  if (score === null)
    return (
      <div
        {...rest}
        className={c('flex items-center justify-center', rest.className)}
      >
        <img
          alt="score no data"
          className="h-full"
          src={p('icons/no-data-score.svg')}
        />
      </div>
    );

  return (
    <div {...rest} className={c('relative', rest.className)} ref={containerRef}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={[
              {
                value: score,
                fill: getColor(),
              },
              {
                value: 100 - score,
                fill: '#e8e8e8',
              },
            ]}
            animationDuration={1000}
            animationBegin={0}
            animationEasing="ease"
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={720}
            innerRadius={innerRadius || '90%'}
            outerRadius="100%"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center">
        <span
          className="score-text block !font-normal text-[#515151]"
          style={{
            fontSize: fontSize !== undefined ? fontSize : '4.5rem',
            lineHeight,
          }}
        >
          {score}
        </span>
        {precentage && (
          <span className="text-xs !font-normal text-theme-light-gray">%</span>
        )}
      </div>
      {showPlane && (
        <div
          className={c(
            'absolute flex justify-center',
            planeSize === 'big' &&
              '-bottom-[12.5px] -left-[12.5px] -right-[12.5px] -top-[12.5px]',
            planeSize === 'small' &&
              '-bottom-[7.5px] -left-[8.5px] -right-[8.5px] -top-[8.5px]'
          )}
          style={{
            rotate: mounted ? `-${(score / 100) * 360}deg` : '0deg',
            transition: 'ease',
            transitionDuration: '1000ms',
          }}
        >
          <img
            alt="aircraft icon"
            src={p(`icons/${getAircraftIcon()}.svg`)}
            className={c(
              '-rotate-90',
              planeSize === 'big' && 'h-11 w-11',
              planeSize === 'small' && 'h-8 w-8'
            )}
          />
        </div>
      )}
    </div>
  );

  function getAircraftIcon() {
    if (!median || median === 'average') return 'aircraft_yellow';
    if (median === 'below') return 'aircraft_red';
    if (median === 'above') return 'aircraft_green';
    if (median === 'neutral') return 'aircraft_blue';
  }

  function getColor() {
    if (!median || median === 'average') return '#f4da21';
    if (median === 'below') return '#fc5656';
    if (median === 'above') return '#7ce027';
    if (median === 'neutral') return '#95d2e8';
  }
};

export default ScorePie;
