import { Modal, Form, Button, Input, Select, Radio, RadioChangeEvent } from 'antd';
import { useState } from 'react';
import { sendUploadBeatReq, getAllBeatsReq } from '../../lib/axios';
import { genreOptions} from '../../utils/genreTags';

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
      const response = await sendUploadBeatReq(formData);
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

  const getAllBeats = async () => {
    try {
      const response = await getAllBeatsReq();
      console.log("beats:\n", response);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Button type='ghost' onClick={() => { setShowModal(true) }} style={{ color: 'white' }} >Upload</Button>
      <Modal title="upload beat modal" open={showModal} closable={true} onCancel={handleCancel} footer={null}>
          <Form>
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
                options={possibleKeyOptions}
                onChange={(e) => setKey(e.target.value)}
              />
              <Radio.Group onChange={(e) => { handleSharpFlatChange(e) }}>
                <Radio value='' checked={flatOrSharp === ''}>None</Radio>
                <Radio value='b' checked={flatOrSharp === '♭'}>♭</Radio>
                <Radio value='#' checked={flatOrSharp === '#'}>#</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <label>Artwork</label>
              <div>
                <input type='file' accept='image/*' hidden={true} onChange={(e) => { if(e.target.files) {setArtwork(e.target.files[0])} }}/>
              </div>
            </Form.Item>
            <Form.Item>
              <label>Beat</label>
              <div>
                <input type='file' accept='mpeg/wav' hidden={true} onChange={(e) => { if(e.target.files) {setAudio(e.target.files[0])} }}/>
              </div>
            </Form.Item>
          </Form>
          
          {/* TODO: make a similar checkAudioFile function */}
          
          <Button type='primary' onClick={() => { handleSubmit(); }} >Upload Beat</Button>
          <Button onClick={() => { getAllBeats(); }} >Get All Beats</Button>
      </Modal>
    </>
)
}