import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  type ResponsiveContainerProps,
} from 'recharts';

interface ImprovementGraphProps
  extends Omit<ResponsiveContainerProps, 'children'> {
  improvementRate: number;
}

const ImprovementGraph: React.FC<ImprovementGraphProps> = ({
  improvementRate,
  ...rest
}) => {
  const graphData = useMemo(() => {
    if (improvementRate.toFixed(1) === '0.0') return [];

    const mid = improvementRate / 4;

    return [{ uv: 0 }, { uv: mid }, { uv: improvementRate }];
  }, [improvementRate]);

  const fill = useMemo(() => {
    const h = improvementRate > 0 ? 90 : 345;
    const s = improvementRate > 0 ? 84 : 74;
    const l = improvementRate > 0 ? 46 : 49;

    return hslToHex(h, s, l);
  }, [improvementRate]);

  return (
    <ResponsiveContainer {...rest}>
      <AreaChart data={graphData} margin={{ top: 8, bottom: 8, right: 6 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={fill} stopOpacity={0.8} />
            <stop offset="1" stopColor={fill} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dot={(props) => {
            const { cx, cy, index } = props;

            if (index === graphData.length - 1)
              return (
                <circle
                  r="5"
                  stroke="#fff"
                  strokeWidth="1"
                  fill={fill}
                  cx={cx}
                  cy={cy}
                  key={index}
                ></circle>
              );

            return <React.Fragment key={index} />;
          }}
          dataKey="uv"
          stroke={fill}
          strokeWidth={2}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0'); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
};

export default ImprovementGraph;
