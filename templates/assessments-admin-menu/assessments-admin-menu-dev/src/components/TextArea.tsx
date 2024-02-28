import { c } from '../lib';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea: React.FC<TextAreaProps> = ({ ...rest }) => {
  return (
    <textarea
      {...rest}
      className={c(
        'resize-none rounded-md border border-theme-light-gray p-4',
        rest.className
      )}
    ></textarea>
  );
};

export default TextArea;
