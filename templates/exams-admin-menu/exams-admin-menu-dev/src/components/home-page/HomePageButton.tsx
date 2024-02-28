import { Link, LinkProps } from 'react-router-dom';
import { c } from '../../lib';

interface HomePageButtonProps extends React.PropsWithChildren, LinkProps {}

const HomePageButton: React.FC<HomePageButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <Link
      {...rest}
      className={c(
        'flex w-full flex-col items-center rounded-md border border-themeLightGray bg-white py-32 text-themeDarkGray transition hover:border-themeBlue',
        rest.className
      )}
    >
      {children}
    </Link>
  );
};

export default HomePageButton;
