import { Modal, Form, Button, Input, Select, Radio, RadioChangeEvent, Divider } from 'antd';
import { CheckCircleOutlined, PictureOutlined, SoundOutlined } from '@ant-design/icons';
import { IoIosMusicalNotes } from 'react-icons/io';
import { useState } from 'react';
import { uploadBeatReq, getAllBeatsReq } from '../../lib/axios';
import { genreOptions} from '../../utils/genreTags';
import UploadButton from '../UploadButton';

export default function UploadBeatModal() {

  const [showModal, setShowModal] = useState<boolean>(false);
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
      const response = await uploadBeatReq(formData);
      console.log(response);
    } catch (err) {
      console.error(err);
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
      <Modal title="Upload Your Beat" open={showModal} onCancel={handleCancel} footer={null}>
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
              <UploadButton label='Beat Upload' allowedFileType='mpeg/wav' uploadStateSetter={setAudio} sideIcon={<SoundOutlined />} />
              {audio ? <CheckCircleOutlined style={{ marginLeft: '1rem', fontSize: '1rem',  }} /> : null}
            </Form.Item>
          </Form>
          <Divider />
          <Button onClick={() => { setShowModal(false); }} >Cancel</Button>
          <Button type='primary' style={{ marginLeft: '1rem', backgroundColor: 'var(--primary)', color: 'black' }} onClick={() => { handleSubmit(); }} >Upload Beat</Button>
      </Modal>
    </>
)
}