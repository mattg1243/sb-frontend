import { Button } from "antd";
import React, { useRef } from "react";
import { PictureOutlined } from "@ant-design/icons";

interface IUploadButtonProps {
  label: string,
  // this audio field needs to be narrowed down to mp3 and wav
  allowedFileType: 'audio/*' | 'image/*'
  uploadStateSetter: Function
  sideIcon? : React.ReactNode
}

export default function UploadButton(props: IUploadButtonProps) {

  const { label, allowedFileType, uploadStateSetter, sideIcon } = props;

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = (e: any) => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  }

  return (
    <>
      <Button onClick={handleClick} icon={sideIcon} >
        {label}
      </Button>
      <input type='file' accept={allowedFileType} style={{ display: 'none' }} ref={hiddenFileInput} onChange={(e) => { if (e.target.files) { uploadStateSetter(e.target.files[0]); }} } />
    </>
  )
}