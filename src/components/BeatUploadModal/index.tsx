import {
  Modal,
  Form,
  Button,
  Input,
  Select,
  Radio,
  RadioChangeEvent,
  Divider,
  Spin,
  Alert,
  Progress,
  List,
  Row,
  Col,
} from 'antd';
import {
  CheckCircleOutlined,
  PictureOutlined,
  SoundOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { getSignedUploadUrlReq, uploadBeatReq } from '../../lib/axios';
import { genreOptions } from '../../utils/genreTags';
import UploadButton from '../UploadButton';
import styles from './BeatUploadModal.module.css';
import gatewayUrl from '../../config/routing';
import { getUserArtistNameFromLocalStorage, getUserIdFromLocalStorage } from '../../utils/localStorageParser';

const possibleKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
export const possibleKeyOptions = possibleKeys.map((key) => ({ value: key, label: key }));
interface Stem {
  audioKey: string;
  trackName: string;
  beatId: string;
}

export default function UploadBeatModal() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' }>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [genreTags, setGenreTags] = useState<Array<string>>(['']);
  const [tempo, setTempo] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [flatOrSharp, setFlatOrSharp] = useState<'flat' | 'sharp' | ''>('');
  const [majorOrMinor, setMajorOrMinor] = useState<'major' | 'minor'>('major');
  const [artwork, setArtwork] = useState<File>();
  const [audio, setAudio] = useState<File>();
  const [stems, setStems] = useState<File[]>([]);

  const stemFileNames: Array<string> = [];

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const stemUploadPromises: Promise<AxiosResponse>[] = [];
    const userId = getUserIdFromLocalStorage();
    const userArtistName = getUserArtistNameFromLocalStorage();
    try {
      setIsUploading(true);
      // first get a url for the beat file since there will be always be one
      const beatUploadUrl = await getSignedUploadUrlReq('beat');
      console.log('Response from beatUploadUrl:\n', beatUploadUrl);
      const { url, s3Key } = beatUploadUrl.data;
      const signedUrlFormData = new FormData();
      signedUrlFormData.append('beat', audio as Blob);
      // start the beat uplaod
      await axios.put(url, audio as Blob, {
        headers: { 'Content-Type': 'audio/*' },
      });

      const hasStems = stems.length > 0;
      const stemFields: Array<Stem> = [];

      const beatFormData = new FormData();
      beatFormData.append('title', title);
      beatFormData.append('genreTags', JSON.stringify(genreTags));
      beatFormData.append('tempo', tempo);
      beatFormData.append('artwork', artwork as Blob);
      beatFormData.append('key', key);
      beatFormData.append('flatOrSharp', flatOrSharp as string);
      beatFormData.append('majorOrMinor', majorOrMinor as string);
      beatFormData.append('s3Key', s3Key);
      beatFormData.append('hasStems', hasStems ? 'true' : 'false');
      // need to add user.id, user.artistName
      beatFormData.append('userId', userId as string);
      beatFormData.append('artistName', userArtistName as string);
      const res = await axios.post(`${gatewayUrl}/beats/save-beat`, beatFormData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // save the beatId
      const beatId = res.data.beatId;
      // check if there are any stems
      if (stems.length > 0) {
        for (let i = 0; i < stems.length; i++) {
          const { url: stemUrl, s3Key: stemS3Key } = (await getSignedUploadUrlReq('stem')).data;
          const stemUplaodPromise = axios.put(stemUrl, stems[i], {
            headers: { 'Content-Type': 'audio/*' },
          });
          stemUploadPromises.push(stemUplaodPromise);
          stemFields.push({ audioKey: stemS3Key, trackName: stems[i].name, beatId: beatId });
        }
      }
      // wait for all stem upload promises to resolve
      await Promise.all(stemUploadPromises);
      // save all the stems in the database
      await axios.post(`${gatewayUrl}/beats/save-stems`, { stems: stemFields }, { withCredentials: true });
      setIsUploading(false);
      setAlert({ message: 'Your beat was uploaded successfully!', type: 'success' });
      window.location.reload();
      console.log(res);
    } catch (err) {
      setAlert({ message: 'There was an error uploading your beat.', type: 'error' });
      setIsUploading(false);
      console.error(err);
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

  // store stem file names in var to display
  useEffect(() => {
    if (stems && stems.length > 0) {
      for (let i = 0; i < stems.length; i++) {
        if (stems[i] instanceof File) {
          const stem = stems[i];
          if (stem) {
            console.log(stem.name);
            stemFileNames.push(stem.name);
          }
        }
      }
    }
  });

  return (
    <>
      <Button
        type="ghost"
        onClick={() => {
          setShowModal(true);
        }}
        style={{ color: 'white' }}
        id="open-modal-btn"
      >
        Upload
      </Button>
      {alert ? <Alert message={alert.message} type={alert.type} closable showIcon /> : null}
      <Modal
        title="Upload Your Beat"
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        className={styles.modal}
        data-cy="modal"
      >
        <Spin
          spinning={isUploading}
          tip={'Your beat is being uploaded, you can close this window. You will be notified when it is done.'}
          indicator={<LoadingOutlined />}
          data-cy="spin"
        >
          <Form style={{ margin: '2rem 2rem', width: '35vw' }}>
            <Form.Item>
              <Input
                placeholder="Title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                data-cy="title-input"
              ></Input>
            </Form.Item>
            <Form.Item>
              <Select
                placeholder="Genre Tags"
                options={genreOptions}
                mode="multiple"
                maxTagCount="responsive"
                onChange={handleGenreTagsChange}
                data-cy="genre-select"
              />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="BPM"
                onChange={(e) => {
                  setTempo(e.target.value);
                }}
                addonAfter="BPM"
                type="number"
                data-cy="bpm-input"
              ></Input>
            </Form.Item>
            <Form.Item>
              <Select placeholder="Key" options={possibleKeyOptions} onChange={handleKeyChange} />
              <Radio.Group
                onChange={(e) => {
                  handleSharpFlatChange(e);
                }}
                style={{ marginTop: '.5rem' }}
                defaultValue={flatOrSharp}
                data-cy="flat-sharp-group"
              >
                <Radio value="" checked={flatOrSharp === ''} data-cy="regular">
                  None
                </Radio>
                <Radio value="flat" checked={flatOrSharp === 'flat'} data-cy="flat">
                  ♭
                </Radio>
                <Radio value="sharp" checked={flatOrSharp === 'flat'} data-cy="sharp">
                  #
                </Radio>
              </Radio.Group>
              <Form.Item>
                <Radio.Group
                  onChange={(e) => {
                    handleMajorMinorChange(e);
                  }}
                  style={{ marginTop: '.5rem' }}
                  defaultValue={majorOrMinor}
                >
                  <Radio value="major" checked={majorOrMinor === 'major'} data-cy="major">
                    Major
                  </Radio>
                  <Radio value="minor" checked={majorOrMinor === 'minor'} data-cy="minor">
                    Minor
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Form.Item>
            <Row>
              <Col>
                <Form.Item>
                  <UploadButton
                    label="Artwork Upload"
                    allowedFileType="image/*"
                    uploadStateSetter={setArtwork}
                    sideIcon={<PictureOutlined />}
                  />
                  {artwork ? <CheckCircleOutlined style={{ marginLeft: '1rem', fontSize: '1rem' }} /> : null}
                </Form.Item>
                <Form.Item>
                  <UploadButton
                    label="Beat Upload"
                    allowedFileType="audio/*"
                    uploadStateSetter={setAudio}
                    sideIcon={<SoundOutlined />}
                  />
                  {audio ? <CheckCircleOutlined style={{ marginLeft: '1rem', fontSize: '1rem' }} /> : null}
                </Form.Item>
                <Form.Item>
                  <UploadButton
                    label="Add Track Stem"
                    allowedFileType="audio/*"
                    uploadMultiStateSetter={setStems}
                    currentState={stems}
                    multiple={true}
                  />
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: '12vw' }}>
                <List
                  dataSource={stems.map((stemFile) => stemFile.name)}
                  bordered
                  size="small"
                  header={<strong>Stems</strong>}
                  renderItem={(item, index) => (
                    <List.Item style={{ width: '25vh' }} key={index}>
                      {item}
                      <DeleteOutlined style={{ marginLeft: '2vw' }} />
                    </List.Item>
                  )}
                  style={{ maxHeight: '10vh' }}
                />
                <ul>
                  {stemFileNames.map((stemName) => (
                    <li>{stemName}</li>
                  ))}
                </ul>
              </Col>
            </Row>
          </Form>
        </Spin>
        <Divider />
        {isUploading ? (
          <Progress percent={uploadProgress} />
        ) : (
          <>
            <Button
              onClick={() => {
                setShowModal(false);
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: '1rem', backgroundColor: 'var(--primary)', color: 'black' }}
              onClick={() => {
                handleSubmit();
              }}
              disabled={isUploading}
            >
              Upload Beat
            </Button>
          </>
        )}
        {uploadProgress > 98 ? (
          <Spin
            tip="Preparing your beat for streaming..."
            indicator={<LoadingOutlined />}
            style={{ marginLeft: '17%' }}
          />
        ) : null}
      </Modal>
    </>
  );
}
