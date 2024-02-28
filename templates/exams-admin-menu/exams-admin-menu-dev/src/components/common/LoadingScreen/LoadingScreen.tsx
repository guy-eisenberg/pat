import { c } from '../../../lib';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ visible, ...rest }) => {
  return (
    <div
      {...rest}
      className={c(
        'loading-screen fixed top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center bg-black/60',
        styles['loading-screen'],
        visible
          ? styles['loading-screen-visible']
          : styles['loading-screen-invisible'],
        rest.className
      )}
    >
      <span className={styles.loader} />
    </div>
  );
};

export default LoadingScreen;
