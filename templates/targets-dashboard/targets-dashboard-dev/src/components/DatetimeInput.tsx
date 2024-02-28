import { useState } from 'react';
import { c, getDatePreview, p } from '../lib';
import Input from './Input';

interface DatetimeInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const DatetimeInput: React.FC<DatetimeInputProps> = ({ ...rest }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <img
        alt="calendar icon"
        className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2"
        src={p('icons/calendar_icon.svg')}
      />
      <Input
        {...rest}
        className={c(
          'h-[42px] appearance-none !pl-12 !text-theme-medium-gray',
          rest.className
        )}
        type={focused ? 'datetime-local' : 'text'}
        onFocus={(e) => {
          if (rest.onFocus) rest.onFocus(e);

          setFocused(true);
        }}
        onTouchStart={(e) => {
          if (rest.onTouchStart) rest.onTouchStart(e);

          setFocused(true);
        }}
        onBlur={(e) => {
          if (rest.onBlur) rest.onBlur(e);

          setFocused(false);
        }}
        value={focused ? rest.value : getDatePreview(rest.value as string)}
      />
    </div>
  );
};

export default DatetimeInput;
