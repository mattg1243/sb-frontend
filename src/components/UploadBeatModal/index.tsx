import { Modal, Form, Button, Input, Select } from 'antd';
import { useState } from 'react';
import { sendUploadBeatReq, getAllBeatsReq } from '../../lib/axios';
import { genreTags as genreTagOptions } from '../../utils/genreTags';

export default function UploadBeatModal() {

  const [showModal, setShowModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [genreTags, setGenreTags] = useState<Array<string>>(['']);
  const [tempo, setTempo] = useState<string>('');
  const [key, setKey] = useState<string>('');
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

  const getAllBeats = async () => {
    try {
      const response = await getAllBeatsReq();
      console.log("beats:\n", response);
    } catch (err) {
      console.log(err);
    }
  }

  interface Option {
    label: string,
    value: string,
  }

  const genreOptions: Option[] = genreTagOptions.map((val) => ({ label: val, value: val }));

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
              <Input placeholder="Key" onChange={(e) => { setKey(e.target.value)}}></Input>
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