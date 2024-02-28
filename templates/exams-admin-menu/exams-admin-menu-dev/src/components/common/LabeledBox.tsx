import { c } from '../../lib';

interface LabeledBoxProps
  extends React.PropsWithChildren,
    React.HTMLAttributes<HTMLDivElement> {
  label: string;
}

const LabeledBox: React.FC<LabeledBoxProps> = ({
  label,
  children,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        'rounded-md border border-themeLightGray bg-white',
        rest.className
      )}
    >
      <div className="border-b border-themeLightGray px-4 py-2 text-themeDarkGray">
        <p>{label}</p>
      </div>
      <div className="flex flex-col items-start px-8 py-4">{children}</div>
    </div>
  );
};

export default LabeledBox;
