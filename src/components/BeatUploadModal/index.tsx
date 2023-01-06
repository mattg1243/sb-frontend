import { Modal, Form, Button, Input, Select, Radio, RadioChangeEvent, Divider, Spin, Alert } from 'antd';
import { CheckCircleOutlined, PictureOutlined, SoundOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadBeatReq } from '../../lib/axios';
import { genreOptions} from '../../utils/genreTags';
import UploadButton from '../UploadButton';

export default function UploadBeatModal() {

  const [showModal, setShowModal] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string, type: 'error' | 'success' }>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [genreTags, setGenreTags] = useState<Array<string>>(['']);
  const [tempo, setTempo] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [flatOrSharp, setFlatOrSharp] = useState<string>();
  const [artwork, setArtwork] = useState<File>();
  const [audio, setAudio] = useState<File>();

  const handleCancel = () => {
    setShowModal(false);
  };

  const possibleKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const possibleKeyOptions = possibleKeys.map((key) => ({value: key, option: key}));

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('genreTags', JSON.stringify(genreTags));
    formData.append('tempo', tempo);
    formData.append('artwork', artwork as Blob);
    formData.append('audio', audio as Blob, audio?.name);
    formData.append('key', key);

    try {
      setIsUploading(true);
      const response = await uploadBeatReq(formData);
      if (response.status === 200) { 
        setAlert({ message: 'Your beat was uploaded successfully!', type: 'success'});
      }
      console.log(response);
    } 
    catch (err) {
      setAlert({ message: 'There was an error uploading your beat.', type: 'error'})
      console.error(err);
    }
    finally {
      setIsUploading(false);
    }
  }

  const handleGenreTagsChange = (val: any) => {
    setGenreTags(val);
  }

  const handleSharpFlatClick = (e: RadioChangeEvent) => {
    if (e.target.checked) {
      e.target.checked = false;
    } else {
      key.concat(e.target.value);
    }
  }

  const handleSharpFlatChange = (e: RadioChangeEvent) => {
    if (key[-1] === e.target.value) { 
      e.target.checked = false;
    } else {
      key.concat(e.target.value);
    }
  }

  return (
    <>
      <Button type='ghost' onClick={() => { setShowModal(true) }} style={{ color: 'white' }} >Upload</Button>
      {alert ?
       <Alert message={alert.message} type={alert.type} closable showIcon /> :
       null
      }
      <Modal title="Upload Your Beat" open={showModal} onCancel={handleCancel} footer={null}>
          <Spin spinning={isUploading} tip={'Your beat is being uploaded, you can close this window. You will be notified when it is done.'}>
            <Form style={{ margin: '2rem 0' }}>
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
                <Input placeholder="Tempo" onChange={(e) => { setTempo(e.target.value)}}></Input>
              </Form.Item>
              <Form.Item>
                <Select
                  placeholder='Key'
                  options={possibleKeyOptions}
                  onChange={(e) => setKey(e.target.value)}
                />
                <Radio.Group onChange={(e) => { handleSharpFlatChange(e) }} style={{ marginTop: '.5rem' }}>
                  <Radio value='' checked={flatOrSharp === ''}>None</Radio>
                  <Radio value='b' checked={flatOrSharp === '♭'}>♭</Radio>
                  <Radio value='#' checked={flatOrSharp === '#'}>#</Radio>
                </Radio.Group>
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
          <Button onClick={() => { setShowModal(false); }} disabled={isUploading} >Cancel</Button>
          <Button type='primary' style={{ marginLeft: '1rem', backgroundColor: 'var(--primary)', color: 'black' }} onClick={() => { handleSubmit(); }} disabled={isUploading} >Upload Beat</Button>
      </Modal>
    </>
)
}