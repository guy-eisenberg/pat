import { useState } from 'react';
import { c } from '../lib';

interface Option {
  id: string;
  label: string;
  tag?: string;
}

interface AutoCompleteInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  options: Option[];
  onOptionSelect: (option: Option) => void;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  className,
  options,
  onOptionSelect,
  ...rest
}) => {
  const [suggestions, setSuggestions] = useState<Option[]>([]);

  return (
    <div className={c('relative text-center', className)}>
      <input
        {...rest}
        type="text"
        className={c(
          'w-full rounded-md border border-theme-light-gray py-3 px-5 font-medium text-theme-extra-dark-gray outline-none placeholder:text-theme-light-gray'
        )}
        onChange={(e) => {
          if (rest.onChange) rest.onChange(e);

          loadSuggestions(e.target.value);
        }}
      />
      <ul
        className={c(
          'absolute top-full mt-2 w-full overflow-hidden rounded-md transition',
          suggestions.length > 0
            ? 'max-h-[unset] border border-theme-light-gray'
            : 'max-h-0'
        )}
      >
        {suggestions.map((suggestion, i) => (
          <li
            key={suggestion.id}
            className={c(
              'group bg-white hover:bg-theme-blue',
              i < suggestions.length - 1 && 'border-b border-b-theme-light-gray'
            )}
          >
            <button
              className="flex h-full w-full items-baseline gap-2 py-2 px-5"
              onClick={() => {
                onOptionSelect(suggestion);

                setSuggestions([]);
              }}
            >
              <span className="font-medium text-theme-extra-dark-gray group-hover:text-white">
                {suggestion.label}
              </span>
              {suggestion.tag && (
                <span className="text-sm text-theme-light-gray group-hover:opacity-50 group-hover:brightness-50">
                  {suggestion.tag}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  function loadSuggestions(value: string) {
    if (value.length === 0) {
      setSuggestions([]);
      return;
    }

    setSuggestions(
      options.filter((option) => option.label.includes(`${rest.value}`))
    );
  }
};

export default AutoCompleteInput;
