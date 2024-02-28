import Button from './Button';
import Modal, { ModalProps } from './Modal';

interface RetryModalProps extends ModalProps {
  retryTarget: () => void;
}

const RetryModal: React.FC<RetryModalProps> = ({ retryTarget, ...rest }) => {
  return (
    <Modal
      {...rest}
      className="flex flex-col items-center text-theme-dark-gray"
    >
      <b className="mb-[2vh]">Are you sure you want to retry this target?</b>
      <div className="flex gap-6">
        <Button color="gray" onClick={rest.hideModal}>
          Cancel
        </Button>
        <Button color="green" onClick={retryTarget}>
          Yes
        </Button>
      </div>
    </Modal>
  );
};

export default RetryModal;
