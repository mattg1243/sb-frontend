import { Modal, Button, Input, Form, Select, Spin, Divider, Radio, RadioChangeEvent } from 'antd';
import { CheckCircleOutlined, PictureOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Beat } from '../../types/beat';
import { genreOptions } from '../../utils/genreTags';
import { deleteBeatReq, updateBeatReq } from '../../lib/axios';
import { possibleKeyOptions } from '../BeatUploadModal';
import { AlertObj } from '../../types/alerts';
import CustomAlert from '../CustomAlert';
import UploadButton from '../UploadButton';

interface IEditBeatModalProps {
  beat: Beat;
}
// TODO: consolidate this and the BeatUploadModal as they share lots of code
export default function BeatEditModal(props: IEditBeatModalProps) {
  const { beat } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>();
  const [deleteIsOpen, setDeleteIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(beat.title);
  const [description, setDescription] = useState<string>(beat.description as string);
  const [tempo, setTempo] = useState<number>(beat.tempo);
  const [key, setKey] = useState<string>(beat.key);
  const [flatOrSharp, setFlatOrSharp] = useState<'flat' | 'sharp' | ''>(beat.flatOrSharp);
  const [majorOrMinor, setMajorOrMinor] = useState(beat.majorOrMinor);
  const [artwork, setArtwork] = useState<File>(); // NOTE: if this is empty, the artowrk will be uneffected
  const [genreTags, setGenreTags] = useState(beat.genreTags);

  const handleCancel = () => {
    setIsOpen(false);
  };

  const deleteBeat = async (beatId: string, audioKey: string) => {
    setDeleteIsOpen(false);
    setIsLoading(true);
    try {
      const response = await deleteBeatReq(beatId, audioKey);
      if (response.status === 200) {
        setIsOpen(false);
        window.location.reload();
      }
      console.log(response.data);
    } catch (err) {
      console.error(err);
      console.log('yee');
    }
    setIsLoading(false);
  };

  const updateBeat = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('genreTags', JSON.stringify(genreTags));
    formData.append('description', description);
    formData.append('tempo', tempo.toString());
    formData.append('artwork', artwork as Blob);
    formData.append('key', key);
    formData.append('flatOrSharp', flatOrSharp as string);
    formData.append('majorOrMinor', majorOrMinor as string);

    try {
      const response = await updateBeatReq(formData, beat._id);
      if (response.status === 200) {
        setIsOpen(false);
        window.location.reload();
      }
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setAlert({ status: 'error', message: 'There was an error updating your beat' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreTagsChange = (val: any) => {
    setGenreTags(val);
  };

  const handleKeyChange = (val: string) => {
    setKey(val);
  };

  const handleSharpFlatChange = (e: RadioChangeEvent) => {
    setFlatOrSharp(e.target.value);
  };

  const handleMajorMinorChange = (e: RadioChangeEvent) => {
    setMajorOrMinor(e.target.value);
  };

  return (
    <>
      <Button
        type="ghost"
        onClick={() => {
          setIsOpen(true);
        }}
        data-cy="edit button"
      >
        Edit
      </Button>
      <Modal
        open={isOpen}
        centered={true}
        onCancel={handleCancel}
        footer={null}
        style={{ padding: '1rem', alignItems: 'center', width: '10rem' }}
      >
        <Spin spinning={isLoading} data-cy="loading spinner">
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal">
            {isLoading ? (
              <div style={{ height: '275px', display: 'flex' }}>
                <Spin style={{ margin: 'auto' }} />
              </div>
            ) : (
              <>
                <Form.Item label="Title" name="title">
                  <Input
                    defaultValue={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    data-cy="title input"
                  />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <Input
                    defaultValue={description}
                    autoComplete={undefined}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    maxLength={140}
                    showCount={true}
                    data-cy="description input"
                  />
                </Form.Item>
                <Form.Item label="Genres" name="genres">
                  <Select
                    placeholder="Genre Tags"
                    options={genreOptions}
                    defaultValue={genreTags}
                    mode="multiple"
                    maxTagCount="responsive"
                    onChange={handleGenreTagsChange}
                  />
                </Form.Item>
                <Form.Item label="BPM" name="bpm">
                  <Input
                    defaultValue={beat.tempo}
                    onChange={(e) => {
                      setTempo(e.target.valueAsNumber);
                    }}
                    max={200}
                    min={60}
                    type="number"
                    addonAfter="BPM"
                    data-cy="tempo"
                  />
                </Form.Item>
                <Form.Item label="Key" name="key">
                  <Select
                    placeholder="Key"
                    options={possibleKeyOptions}
                    onChange={handleKeyChange}
                    defaultValue={key}
                  />
                </Form.Item>
                <Radio.Group
                  onChange={(e) => {
                    handleSharpFlatChange(e);
                  }}
                  style={{ marginTop: '.5rem' }}
                  defaultValue={flatOrSharp}
                >
                  <Radio value="" checked>
                    None
                  </Radio>
                  <Radio value="flat">♭</Radio>
                  <Radio value="sharp">#</Radio>
                </Radio.Group>
                <Form.Item>
                  <Radio.Group
                    onChange={(e) => {
                      handleMajorMinorChange(e);
                    }}
                    style={{ marginTop: '.5rem' }}
                    defaultValue={majorOrMinor}
                  >
                    <Radio value="major">Major</Radio>
                    <Radio value="minor">Minor</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item>
                  <UploadButton
                    label="Artwork Upload"
                    allowedFileType="image/*"
                    uploadStateSetter={setArtwork}
                    sideIcon={<PictureOutlined />}
                  />
                  {artwork ? <CheckCircleOutlined style={{ marginLeft: '1rem', fontSize: '1rem' }} /> : null}
                </Form.Item>
              </>
            )}
          </Form>
          {alert ? <CustomAlert message={alert.message} status={alert.status} /> : null}
        </Spin>
        <Divider />
        <Button
          key="delete"
          onClick={() => {
            setDeleteIsOpen(true);
          }}
          color="red"
        >
          Delete Beat
        </Button>
        <Button
          key="update"
          type="primary"
          style={{ marginLeft: '1rem', backgroundColor: 'var(--primary)', color: 'black' }}
          onClick={() => {
            updateBeat();
          }}
        >
          Save Changes
        </Button>
      </Modal>
      <Modal
        centered={true}
        open={deleteIsOpen}
        onOk={() => {
          deleteBeat(beat._id, beat.audioKey);
        }}
        onCancel={() => {
          setDeleteIsOpen(false);
        }}
        footer={[
          <Button>Cancel</Button>,
          <Button
            type="primary"
            style={{ marginLeft: '1rem', backgroundColor: 'var(--primary)', color: 'black' }}
            onClick={() => deleteBeat(beat._id, beat.audioKey)}
          >
            Delete Beat
          </Button>,
        ]}
      >
        Are you sure you want to delete this beat?
      </Modal>
    </>
  );
}
