import { message } from "antd";
import type { RcFile } from "antd/es/upload";

export const checkImgFile = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB');
  }
  return isJpgOrPng && isLt2M;
};

export const checkAudioFile = (file: RcFile) => {
  // check file type
  const isAudioFile = file.type === 'audio/mpeg' || file.type === 'audio/wav';
  if (!isAudioFile) {
    message.error('You can only upload MP3/WAV files');
  }
  // check file size
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message.error('Audio file must be less than 50MB');
  }
  return isAudioFile && isLt50M;
}