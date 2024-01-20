import { Button } from 'antd';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { AlertObj } from '../types';

interface IUploadProps {
  label: string;
  allowedFileType: 'audio/*' | 'image/*';
  sideIcon?: React.ReactNode;
  disabled?: boolean;
  alertSetter: Dispatch<SetStateAction<AlertObj | undefined>>;
}

interface ISingleUploadButtonProps extends IUploadProps {
  uploadStateSetter?: Dispatch<SetStateAction<Blob | File | undefined>>;
}

interface IMultiUploadButtonProps extends IUploadProps {
  multiple?: boolean;
  uploadMultiStateSetter?: Dispatch<SetStateAction<File[]>>;
  currentState?: File[];
}

// this should be a union, but it wont pick up fields that are unique to each type...
type Props = ISingleUploadButtonProps & IMultiUploadButtonProps;

export default function UploadButton(props: Props) {
  const [hasFile, setHasFile] = useState<boolean>(false);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        icon={props.sideIcon}
        disabled={props.disabled}
        style={{ border: hasFile ? '2px solid green' : undefined }}
      >
        {props.label}
      </Button>
      <input
        type="file"
        accept={
          props.allowedFileType === 'image/*'
            ? 'image/jpg, image/jpeg, image/png, image/gif, image/bmp'
            : 'audio/mpeg, audio/flac, audio/wave, audio/wav, audio/aac'
        }
        style={{ display: 'none' }}
        ref={hiddenFileInput}
        multiple={props.multiple}
        onChange={(e) => {
          // check image size
          if (e.target.files) {
            setHasFile(true);
            console.log('file size (mb): ', e.target.files[0].size / 1024 / 1024);
            if (props.allowedFileType === 'image/*' && e.target.files[0].size / 1024 / 1024 > 4) {
              props.alertSetter({ type: 'error', message: 'The artwork you provided is too large (max size 4mb)' });
              e.target.files = null;
              setHasFile(false);
              return;
            }
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
            setHasFile(false);
            console.warn('No files');
          }
        }}
      />
    </>
  );
}
