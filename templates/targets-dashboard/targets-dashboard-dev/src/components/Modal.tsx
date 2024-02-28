import { c } from '../lib';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  hideModal: () => void;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  hideModal,
  children,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        'absolute left-0 right-0 top-0 z-20 flex items-center justify-center bg-white transition-all md:bottom-0 md:bg-black/40',
        visible ? 'visible opacity-100' : 'invisible opacity-0'
      )}
      onClick={(e) => {
        if (rest.onClick) rest.onClick(e);

        hideModal();
      }}
    >
      <div
        className={c(
          'bg-white px-6 py-4 md:max-w-[90%] md:rounded-[3px] md:shadow-md',
          rest.className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
