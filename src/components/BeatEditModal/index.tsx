import { Modal, Button, Input, Form, Select, Spin } from 'antd';
import { useState } from 'react';
import { Beat } from '../../types/beat';
import { genreOptions } from '../../utils/genreTags';
import { deleteBeatReq, updateBeatReq } from '../../lib/axios';
import { AlertObj } from '../../types/alerts';
import CustomAlert from '../CustomAlert';

interface IEditBeatModalProps {
  beat: Beat
}

export default function BeatEditModal(props: IEditBeatModalProps) {
  const { beat } = props;
  const currentGenreTags = beat.genreTags.map((val) => ({label: val, value: val}));

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>();
  const [deleteIsOpen, setDeleteIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(beat.title);
  const [description, setDescription] = useState<string>(beat.description as string);
  const [tempo, setTempo] = useState<number>(beat.tempo);
  const [key, setKey] = useState<string>(beat.key);
  const [artwork, setArtwork] = useState<File | Blob>();    // NOTE: if this is empty, the artowrk will be uneffected
  const [genreTags, setGenreTags] = useState(beat.genreTags);

  const handleCancel = () => {
    setIsOpen(false);
  }

  const deleteBeat = async (beatId: string) => {
    try {
      const response = await deleteBeatReq(beatId);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  const updateBeat = async () => {
    setIsLoading(true);
    const updatedBeat = {
      ...beat,
      title,
      description,
      genreTags,
      tempo,
      key,
      // artwork,
    }
    try {
      const response = await updateBeatReq(updatedBeat);
      if (response.status === 200) {
        setIsOpen(false);
        window.location.reload();
      }
      console.log(response.data);
    } 
    catch (err) {
      console.error(err);
      setAlert({status: 'error', message: 'There was an error updating your beat'});
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleGenreTagsChange = (val: any) => {
    setGenreTags(val);
  }

  return (
    <>
    <Button type='ghost' onClick={() => {setIsOpen(true)}}>Edit</Button>
    <Modal 
      open={isOpen}
      centered={true}
      onCancel={handleCancel} 
      footer={[ 
        <Button key='delete' onClick={() => { setDeleteIsOpen(true); }} color='red' >Delete Beat</Button>,
        <Button key='update' type='primary' onClick={() => { updateBeat(); }} >Save Changes</Button>
      ]}
    >
      <Spin spinning={isLoading} >
        <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        >
        {isLoading ? 
          <div style={{ height: '275px', display: 'flex' }}>
            <Spin style={{ margin: 'auto' }} />
          </div>
           : 
          <>
            <Form.Item label='Title' name='title'>
              <Input defaultValue={title} onChange={(e) => { setTitle(e.target.value); }} />
            </Form.Item>
            <Form.Item label='Description' name='description'>
              <Input defaultValue={beat.description as string} autoComplete={undefined} onChange={(e) => { setDescription(e.target.value); }} maxLength={140} showCount={true} />
            </Form.Item>
            <Form.Item label='Genres' name='genres'>
            <Select 
              placeholder="Genre Tags"
              options={genreOptions}
              defaultValue={genreTags}
              mode='multiple'
              maxTagCount='responsive'
              onChange={handleGenreTagsChange}
            />
            </Form.Item>
            <Form.Item label='Tempo' name='tempo'>
              <Input defaultValue={beat.tempo} onChange={(e) => { setTempo(e.target.valueAsNumber); }} max={200} min={60} type='number' addonAfter='BPM'/>
            </Form.Item>
            <Form.Item label='Key' name='key'>
              <Input defaultValue={beat.key} onChange={(e) => { setKey(e.target.value); }}/>
            </Form.Item>
          </>}
        </Form>
        {alert ? 
          <CustomAlert message={alert.message} status={alert.status} /> :
          null
        }
      </Spin>
    </Modal>
    <Modal centered={true} open={deleteIsOpen} onOk={() => { deleteBeat(beat._id) }} onCancel={() => { setDeleteIsOpen(false) }}>
      Are you sure you want to delete this beat?
    </Modal>
    </>
  )
}