import { Modal, Button } from 'antd';
import { useState } from 'react';

interface IButtonInfo {
  label: string;
  onClick: () => void;
}

interface IModalFormProps {
  form: React.ReactNode;
  saveButton: IButtonInfo;
}

export default function ModalForm(props: IModalFormProps) {
  const { form, saveButton } = props;
  const { label, onClick } = saveButton;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      footer={[
        <Button onClick={handleCancel}>Cancel</Button>,
        <Button
          onClick={(e) => {
            onClick();
          }}
        >
          {label}
        </Button>,
      ]}
    >
      {form}
    </Modal>
  );
}
