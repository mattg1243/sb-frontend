import { Button } from "antd";
import React, { useRef } from "react";

interface IUploadButtonProps {
  label: string,
  // this audio field needs to be narrowed down to mp3 and wav
  allowedFileType: 'audio/*' | 'image/*'
  uploadStateSetter: Function,
  sideIcon? : React.ReactNode,
  disabled?: boolean,
}

export default function UploadButton(props: IUploadButtonProps) {

  const { label, allowedFileType, uploadStateSetter, sideIcon, disabled } = props;

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = (e: any) => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  }

  return (
    <>
      <Button onClick={handleClick} icon={sideIcon} disabled={disabled} >
        {label}
      </Button>
      <input type='file' accept={allowedFileType} style={{ display: 'none' }} ref={hiddenFileInput} onChange={(e) => { if (e.target.files) { uploadStateSetter(e.target.files[0]); }} } />
    </>
  )
}