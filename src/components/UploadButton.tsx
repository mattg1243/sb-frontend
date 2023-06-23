import { Button } from 'antd';
import React, { Dispatch, SetStateAction, useRef } from 'react';

interface IUploadProps {
  label: string;
  allowedFileType: 'audio/*' | 'image/*';
  sideIcon?: React.ReactNode;
  disabled?: boolean;
}

interface ISingleUploadButtonProps extends IUploadProps {
  uploadStateSetter?: Dispatch<SetStateAction<File | undefined>>;
}

interface IMultiUploadButtonProps extends IUploadProps {
  multiple?: boolean;
  uploadMultiStateSetter?: Dispatch<SetStateAction<File[]>>;
  currentState?: File[];
}

// this should be a union, but it wont pick up fields that are unique to each type...
type Props = ISingleUploadButtonProps & IMultiUploadButtonProps;

export default function UploadButton(props: Props) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  return (
    <>
      <Button onClick={handleClick} icon={props.sideIcon} disabled={props.disabled}>
        {props.label}
      </Button>
      <input
        type="file"
        accept={props.allowedFileType}
        style={{ display: 'none' }}
        ref={hiddenFileInput}
        multiple={props.multiple}
        onChange={(e) => {
          console.log(props.multiple);
          if (e.target.files) {
            if (props.uploadStateSetter) {
              props.uploadStateSetter(e.target.files[0]);
            } else if (props.multiple && props.uploadMultiStateSetter && props.currentState) {
              props.uploadMultiStateSetter([...props.currentState, e.target.files[0]]);
              console.log('uploading stems');
            } else {
              console.error(
                'Error occured in UploadButton component handleChange fn call: either there was no multifile or stateSetter passed in'
              );
            }
          } else {
            console.warn('No files');
          }
        }}
      />
    </>
  );
}
