import { Modal, Form, Button, Input, Select, Radio, RadioChangeEvent, Divider, Spin, Alert, Progress } from 'antd';
import { CheckCircleOutlined, PictureOutlined, SoundOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { uploadBeatReq } from '../../lib/axios';
import { genreOptions} from '../../utils/genreTags';
import UploadButton from '../UploadButton';

const possibleKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
export const possibleKeyOptions = possibleKeys.map((key) => ({value: key, label: key}));

export default function UploadBeatModal() {

  const [showModal, setShowModal] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string, type: 'error' | 'success' }>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isPreparingBeat, setIsPreparingBeat] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [genreTags, setGenreTags] = useState<Array<string>>(['']);
  const [tempo, setTempo] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [flatOrSharp, setFlatOrSharp] = useState<string>();
  const [majorOrMinor, setMajorOrMinor] = useState<string>()
  const [artwork, setArtwork] = useState<File>();
  const [audio, setAudio] = useState<File>();

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('genreTags', JSON.stringify(genreTags));
    formData.append('tempo', tempo);
    formData.append('artwork', artwork as Blob);
    formData.append('audio', audio as Blob, audio?.name);
    formData.append('key', key);
    formData.append('flatOrSharp', flatOrSharp as string);
    formData.append('majorOrMinor', majorOrMinor as string);

    try {
      setIsUploading(true);
      const response = await uploadBeatReq(formData, setUploadProgress);
      if (response.status === 200) { 
        setAlert({ message: 'Your beat was uploaded successfully!', type: 'success'});
        window.location.reload();
      }
      console.log(response);
    } 
    catch (err) {
      setAlert({ message: 'There was an error uploading your beat.', type: 'error'})
      console.error(err);
    }
    finally {
      setIsPreparingBeat(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  const handleGenreTagsChange = (val: any) => {
    setGenreTags(val);
  }

  const handleKeyChange = (val: string) => {
    setKey(val);
  }

  const handleSharpFlatClick = (e: RadioChangeEvent) => {
    if (e.target.checked) {
      e.target.checked = false;
    } else {
      key.concat(e.target.value);
    }
  }

  const handleSharpFlatChange = (e: RadioChangeEvent) => {
    setFlatOrSharp(e.target.value);
  }

  const handleMajorMinorChange = (e: RadioChangeEvent) => {
    setMajorOrMinor(e.target.value);
  };

  useEffect(() => {
    console.log(possibleKeyOptions);
  })

  return (
    <>
      <Button type='ghost' onClick={() => { setShowModal(true) }} style={{ color: 'white' }} >Upload</Button>
      {alert ?
       <Alert message={alert.message} type={alert.type} closable showIcon /> :
       null
      }
      <Modal title="Upload Your Beat" open={showModal} onCancel={handleCancel} footer={null} style={{ display: 'flex', alignItems: 'center', width: '10rem' }}>
          <Spin spinning={isUploading} tip={'Your beat is being uploaded, you can close this window. You will be notified when it is done.'} indicator={<LoadingOutlined />} >
            <Form style={{ margin: '2rem 2rem', width: '20rem' }}>
              <Form.Item>
                <Input placeholder='Title' onChange={(e) => { setTitle(e.target.value)}}></Input>
              </Form.Item>
              <Form.Item>
                <Select 
                  placeholder="Genre Tags"
                  options={genreOptions}
                  mode='multiple'
                  maxTagCount='responsive'
                  onChange={handleGenreTagsChange}
                />
              </Form.Item>
              <Form.Item>
                <Input 
                  placeholder="BPM" 
                  onChange={(e) => { setTempo(e.target.value)}} 
                  addonAfter='BPM' 
                  type='number' >
                </Input>
              </Form.Item>
              <Form.Item>
                <Select
                  placeholder='Key'
                  options={possibleKeyOptions}
                  onChange={handleKeyChange}
                />
                <Radio.Group onChange={(e) => { handleSharpFlatChange(e) }} style={{ marginTop: '.5rem' }}>
                  <Radio value='' checked={flatOrSharp === ''}>None</Radio>
                  <Radio value='flat' checked={flatOrSharp === '♭'}>♭</Radio>
                  <Radio value='sharp' checked={flatOrSharp === '#'}>#</Radio>
                </Radio.Group>
                <Form.Item>
                  <Radio.Group onChange={(e) => { handleMajorMinorChange(e) }} style={{ marginTop: '.5rem' }}>
                    <Radio value='major' checked={majorOrMinor === 'major'}>Major</Radio>
                    <Radio value='minor' checked={majorOrMinor === 'minor'}>Minor</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <UploadButton label='Artwork Upload' allowedFileType='image/*' uploadStateSetter={setArtwork} sideIcon={<PictureOutlined />} />
                {artwork ? <CheckCircleOutlined style={{ marginLeft: '1rem', fontSize: '1rem',  }} /> : null}
              </Form.Item>
              <Form.Item>
                <UploadButton label='Beat Upload' allowedFileType='audio/*' uploadStateSetter={setAudio} sideIcon={<SoundOutlined />} />
                {audio ? <CheckCircleOutlined style={{ marginLeft: '1rem', fontSize: '1rem',  }} /> : null}
              </Form.Item>
            </Form>
          </Spin>
          <Divider />
          {isUploading ? 
          <Progress percent={uploadProgress} /> : 
          <>
          <Button onClick={() => { setShowModal(false); }} disabled={isUploading} >Cancel</Button>
          <Button type='primary' style={{ marginLeft: '1rem', backgroundColor: 'var(--primary)', color: 'black' }} onClick={() => { handleSubmit(); }} disabled={isUploading} >Upload Beat</Button>
          </>}
          {uploadProgress > 98 ? 
          <Spin tip='Preparing your beat for streaming...' indicator={<LoadingOutlined />} style={{ marginLeft: '17%' }} /> : null}
      </Modal>
    </>
)
}