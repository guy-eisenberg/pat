import { useLayoutEffect, useRef, useState } from 'react';
import { c } from '../../lib';

interface Option {
  key: string;
  label: string | React.ReactNode;
}

interface HorizontalRadioProps extends React.HTMLAttributes<HTMLDivElement> {
  options: Option[];
  selectedOption: string;
  onOptionChange: (option: string) => void;
}

const HorizontalRadio: React.FC<HorizontalRadioProps> = ({
  options,
  selectedOption,
  onOptionChange,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedWidth, setSelectedWidth] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const selectedElement = containerRef.current.querySelector(
      '.selected'
    ) as HTMLButtonElement;

    const left =
      selectedElement.getBoundingClientRect().left -
      containerRef.current.getBoundingClientRect().left;

    setSelectedWidth(selectedElement.clientWidth);
    setSelectedLeft(left);
  }, [selectedOption]);

  return (
    <div
      {...rest}
      className={c(
        'relative flex gap-1 rounded-full border border-theme-border bg-[#ededed] p-1 text-theme-medium-gray md:gap-4',
        rest.className
      )}
      ref={containerRef}
    >
      <div
        className="absolute bottom-1 top-1 rounded-full bg-[#3793d1] transition-all"
        style={{ width: selectedWidth, left: selectedLeft }}
      />
      {options.map((option) => {
        const selected = selectedOption === option.key;

        return (
          <button
            key={option.key}
            className={c(
              'select-option relative rounded-full px-2 py-1 transition md:px-4 md:py-2',
              selected
                ? 'selected text-white'
                : 'bg-[#ededed] hover:brightness-90'
            )}
            onClick={() => onOptionChange(option.key)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default HorizontalRadio;
