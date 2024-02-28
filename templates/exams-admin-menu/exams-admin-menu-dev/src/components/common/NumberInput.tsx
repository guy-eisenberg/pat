import { useEffect, useState } from 'react';
import { c, p } from '../../lib';
import Input from './Input';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onInputChange: (num: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
  onInputChange,
  ...rest
}) => {
  const [value, setValue] = useState(rest.value);

  useEffect(() => setValue(rest.value), [rest.value]);

  return (
    <div className={c('relative overflow-hidden rounded-md', rest.className)}>
      <Input
        {...rest}
        className="!h-[37.5px] w-full !border-themeLightGray"
        value={value}
        type="number"
        onChange={(e) => onInputChange(parseInt(e.target.value))}
      />
      <div className="absolute bottom-0 right-0 top-0 flex flex-col rounded-md">
        <button
          className="flex h-1/2 w-12 items-center justify-center border border-themeDarkBlue bg-themeBlue text-white"
          onClick={() => {
            var newValue: number = 0;

            switch (typeof value) {
              case 'string':
                newValue = parseInt(value) + 1;
                break;
              case 'number':
                newValue = value + 1;
                break;
            }

            if (rest.max && newValue > parseInt(`${rest.max}`)) return;

            setValue(newValue);

            onInputChange(newValue);
          }}
        >
          <img
            className="h-2 w-2 rotate-180"
            src={p('icons/drop_down_arrow.svg')}
            alt="up arrow"
          />
        </button>
        <button
          className="flex h-1/2 w-12 items-center justify-center border border-themeDarkBlue bg-themeBlue text-white"
          onClick={() => {
            var newValue: number = 0;

            switch (typeof value) {
              case 'string':
                newValue = parseInt(value) - 1;
                break;
              case 'number':
                newValue = value - 1;
                break;
            }

            if (rest.min && newValue < parseInt(`${rest.min}`)) return;

            setValue(newValue);

            onInputChange(newValue);
          }}
        >
          <img
            className="h-2 w-2"
            src={p('icons/drop_down_arrow.svg')}
            alt="down arrow"
          />
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
