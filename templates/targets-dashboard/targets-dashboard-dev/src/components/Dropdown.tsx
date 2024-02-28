import { useEffect, useState } from 'react';
import { c, p } from '../lib';

interface DropdownProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: { label: string; key: any }[];
  selected: any;
  onOptionChange: (key: any) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onOptionChange,
  ...rest
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.addEventListener('click', dismissMenu);

    return () => document.removeEventListener('click', dismissMenu);

    function dismissMenu() {
      setMenuOpen(false);
    }
  }, []);

  return (
    <button
      {...rest}
      className={c(
        'relative rounded-[3px] border border-theme-border bg-white transition-all',
        menuOpen ? 'rounded-b-none' : '',
        rest.className
      )}
      onClick={(e) => {
        e.stopPropagation();

        setMenuOpen(!menuOpen);
      }}
    >
      <div className="relative flex h-full px-[0.8rem] py-2">
        <p>{options.find((option) => option.key === selected)?.label}</p>
        <div
          className={c(
            'absolute bottom-0 right-0 top-0 flex w-10 items-center justify-center rounded-r-[3px] border border-theme-dark-blue bg-theme-dark-blue text-white transition-all',
            menuOpen ? 'rounded-br-none' : undefined
          )}
        >
          <img
            className={c(
              'h3 w-3 transition',
              menuOpen ? 'rotate-180' : 'rotate-0'
            )}
            src={p('icons/drop_down_arrow.svg')}
            alt="up arrow"
          />
        </div>
      </div>
      <ul
        className={c(
          'absolute left-[-1px] z-10 box-content w-full overflow-y-auto rounded-b-[3px] bg-white transition-all',
          menuOpen ? 'border border-t-0 border-theme-border' : 'border-none'
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
    </button>
  );
};

export default Dropdown;
