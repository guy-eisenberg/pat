import React, { useEffect, useRef, useState } from 'react';
import { c } from '../../lib';

interface HorizontalRadioProps extends React.HTMLAttributes<HTMLDivElement> {
  options: { key: React.Key; label: string }[];
  selectedOptionKey: React.Key;
  onOptionSelect: (key: React.Key) => void;
}

const HorizontalRadio: React.FC<HorizontalRadioProps> = ({
  options,
  selectedOptionKey,
  onOptionSelect,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [bubbleLeft, setBubbleLeft] = useState(0);
  const [bubbleWidth, setBubbleWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const selectedElement =
      containerRef.current.querySelector('button.selected');

    if (!selectedElement) return;

    setBubbleWidth(selectedElement.clientWidth);

    const parentElement = selectedElement.parentElement;

    if (!parentElement) return;

    setBubbleLeft(
      selectedElement.getBoundingClientRect().left -
        parentElement.getBoundingClientRect().left
    );
  }, [selectedOptionKey]);

  return (
    <div
      {...rest}
      className={c(
        'h-16 rounded-full border border-themeLightGray bg-[#fbfbfb] px-6 py-2 text-themeDarkGray',
        rest.className
      )}
      ref={containerRef}
    >
      <div className="relative flex h-full justify-between">
        <div
          className={c(
            'absolute top-0 box-content h-full -translate-x-4 rounded-full bg-themeBlue px-4 transition-all'
          )}
          style={{ width: bubbleWidth, left: bubbleLeft }}
        />
        {options.map((option) => {
          const selected = selectedOptionKey === option.key;

          return (
            <button
              className={c('relative', selected && 'selected text-white')}
              onClick={() => onOptionSelect(option.key)}
              key={option.key}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalRadio;
