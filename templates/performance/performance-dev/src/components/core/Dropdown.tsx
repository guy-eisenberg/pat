import { useEffect, useMemo, useState } from 'react';
import { c, p } from '../../lib';

interface DropdownProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: { label: string; key: string }[];
  selected: string;
  dir?: 'up' | 'down';
  onOptionChange: (key: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  dir = 'down',
  onOptionChange,
  ...rest
}) => {
  // const selectRef = useRef<HTMLSelectElement>(null);

  // const { isMobile } = useDeviceInfo();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.addEventListener('click', dismissMenu);

    return () => document.removeEventListener('click', dismissMenu);

    function dismissMenu() {
      setMenuOpen(false);
    }
  }, []);

  const selectedOptionLabel = useMemo(() => {
    const option = options.find((option) => option.key === selected);

    if (!option) return '';

    return option.label;
  }, [options, selected]);

  return (
    <button
      {...rest}
      className={c(
        'relative rounded-md border border-r-0 border-theme-light-gray bg-white transition-all',
        menuOpen ? (dir === 'down' ? 'rounded-b-none' : 'rounded-t-none') : '',
        rest.className
      )}
      onClick={(e) => {
        e.stopPropagation();

        setMenuOpen(!menuOpen);

        // if (!isMobile) setMenuOpen(!menuOpen);
        // else {
        //   if (!selectRef.current) return;

        //   selectRef.current.dispatchEvent(new MouseEvent('mousedown'));
        // }
      }}
    >
      {dir === 'up' && (
        <ul
          className={c(
            'absolute left-[-1px] right-0 z-10 box-content -translate-y-full overflow-y-auto rounded-t-md bg-white transition-all',
            menuOpen
              ? 'border border-b-0 border-theme-light-gray'
              : 'border-none'
          )}
          style={{
            maxHeight: menuOpen ? Math.min(options.length - 1, 4) * 40 : 0,
          }}
        >
          {options
            .filter((option) => option.key !== selected)
            .map((option) => (
              <li
                key={option.key}
                className="w-full bg-white p-2 text-left transition hover:brightness-95"
                onClick={() => onOptionChange(option.key)}
              >
                {option.label}
              </li>
            ))}
        </ul>
      )}
      <div className="relative flex h-full rounded-md p-2">
        <span>{selectedOptionLabel}</span>
        <div
          className={c(
            'absolute bottom-0 right-0 top-0 flex w-10 items-center justify-center rounded-r-md bg-[#3793d1] text-white transition-all',
            menuOpen
              ? dir === 'down'
                ? 'rounded-br-none'
                : 'rounded-tr-none'
              : undefined
          )}
        >
          <img
            className={c(
              'h3 w-3 transition',
              menuOpen ? 'rotate-90' : '-rotate-90'
            )}
            src={p('icons/arrow.svg')}
            alt="up arrow"
          />
        </div>
      </div>
      {dir === 'down' && (
        <ul
          className={c(
            'absolute left-[-1px] z-10 box-content w-full overflow-y-auto rounded-b-md bg-white transition-all',
            menuOpen
              ? 'border border-t-0 border-theme-light-gray'
              : 'border-none'
          )}
          style={{
            maxHeight: menuOpen ? Math.min(options.length - 1, 4) * 40 : 0,
          }}
        >
          {options
            .filter((option) => option.key !== selected)
            .map((option) => (
              <li
                key={option.key}
                className="w-full bg-white p-2 text-left transition hover:brightness-95"
                onClick={() => onOptionChange(option.key)}
              >
                {option.label}
              </li>
            ))}
        </ul>
      )}

      {/* {isMobile && (
        <select
          className="absolute h-0 w-0 opacity-0"
          value={selected}
          onChange={(e) => onOptionChange(e.target.value)}
          ref={selectRef}
        >
          {options.map((option) => (
            <option value={option.key} key={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      )} */}
    </button>
  );
};

export default Dropdown;
