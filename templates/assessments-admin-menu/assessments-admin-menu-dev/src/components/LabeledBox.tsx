import { c } from '../lib';

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
        'rounded-md border border-theme-light-gray bg-white',
        rest.className
      )}
    >
      <div className="border-b border-b-theme-light-gray px-4 py-2 text-theme-dark-gray">
        <p>{label}</p>
      </div>
      <div className="flex flex-col items-start px-8 py-4">{children}</div>
    </div>
  );
};

export default LabeledBox;
