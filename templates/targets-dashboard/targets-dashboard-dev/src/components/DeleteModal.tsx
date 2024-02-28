import Button from './Button';
import Modal, { ModalProps } from './Modal';

interface DeleteModalProps extends ModalProps {
  deleteTarget: () => void;
}

const ExitModal: React.FC<DeleteModalProps> = ({ deleteTarget, ...rest }) => {
  return (
    <Modal
      {...rest}
      className="flex flex-col items-center text-theme-dark-gray"
    >
      <b className="mb-[2vh]">Are you sure you want to delete this target?</b>
      <div className="flex gap-6">
        <Button color="gray" onClick={rest.hideModal}>
          Cancel
        </Button>
        <Button color="red" onClick={deleteTarget}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default ExitModal;
