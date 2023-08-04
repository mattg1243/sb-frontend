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
import { useDispatch } from 'react-redux';
import { notification } from '../../reducers/notificationReducer';
import { Keys } from '../../types';

export const possibleKeyOptions = Keys.map((key) => ({ value: key, label: key }));
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
  const [stemUploadProgress, setStemUploadProgress] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [genreTags, setGenreTags] = useState<Array<string>>();
  const [tempo, setTempo] = useState<string>();
  const [key, setKey] = useState<string>();
  const [flatOrSharp, setFlatOrSharp] = useState<'♭' | '♯' | ''>('');
  const [majorOrMinor, setMajorOrMinor] = useState<'major' | 'minor'>('major');
  const [artwork, setArtwork] = useState<File>();
  const [audio, setAudio] = useState<File>();
  const [stems, setStems] = useState<File[]>([]);

  const stemFileNames: Array<string> = [];

  const dispatch = useDispatch();

  const handleCancel = () => {
    setShowModal(false);
  };

  const validForm = () => {
    return (
      title.length > 0 && genreTags !== undefined && key !== undefined && tempo !== undefined && audio !== undefined
    );
  };

  const handleSubmit = async () => {
    if (validForm()) {
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
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
          },
        });

        const hasStems = stems.length > 0;
        const stemFields: Array<Stem> = [];

        const beatFormData = new FormData();
        beatFormData.append('title', title);
        beatFormData.append('genreTags', JSON.stringify(genreTags));
        beatFormData.append('tempo', tempo as string);
        beatFormData.append('artwork', artwork as Blob);
        beatFormData.append('key', key as string);
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
          let sizeOfStems = 0;
          let uploadedStemBytes = 0;
          for (let i = 0; i < stems.length; i++) {
            sizeOfStems += stems[i].size;
            const { url: stemUrl, s3Key: stemS3Key } = (await getSignedUploadUrlReq('stem')).data;
            const stemUplaodPromise = axios.put(stemUrl, stems[i], {
              headers: { 'Content-Type': 'audio/*' },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  uploadedStemBytes += progressEvent.bytes;
                  setStemUploadProgress(Math.round((uploadedStemBytes * 100) / sizeOfStems));
                }
              },
            });
            stemUploadPromises.push(stemUplaodPromise);
            stemFields.push({ audioKey: stemS3Key, trackName: stems[i].name, beatId: beatId });
          }
          // wait for all stem upload promises to resolve
          await Promise.all(stemUploadPromises);
          // save all the stems in the database
          await axios.post(`${gatewayUrl}/beats/save-stems`, { stems: stemFields }, { withCredentials: true });
        }
        dispatch(notification({ message: 'Your beat was uploaded successfully!', type: 'success' }));
        console.log(res);
      } catch (err) {
        dispatch(notification({ message: 'There was an error uploading your beat.', type: 'error' }));
        setIsUploading(false);
        console.error(err);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        setStemUploadProgress(0);
      }
    } else {
      setAlert({ type: 'error', message: 'Missing a required field' });
      console.log('Missing required field');
    }
  };

  const handleGenreTagsChange = (val: any) => {
    setGenreTags(val);
  };

  const handleKeyChange = (val: string) => {
    setKey(val);
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
        data-cy="upload-modal-nav"
      >
        Upload
      </Button>
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
                showCount
                minLength={6}
              ></Input>
            </Form.Item>
            <Form.Item required={true}>
              <Select
                placeholder="Genre Tags"
                options={genreOptions}
                mode="multiple"
                maxTagCount="responsive"
                onChange={handleGenreTagsChange}
                data-cy="genre-select"
              />
            </Form.Item>
            <Form.Item required>
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
            <Form.Item required>
              <Select placeholder="Key" options={possibleKeyOptions} onChange={handleKeyChange} />
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
                    data-cy="beat-upload-beat-input"
                  />
                  {audio ? <CheckCircleOutlined style={{ marginLeft: '1rem', fontSize: '1rem' }} /> : null}
                </Form.Item>
                <Form.Item>
                  <UploadButton
                    label="Add Track Stems"
                    allowedFileType="audio/*"
                    uploadMultiStateSetter={setStems}
                    currentState={stems}
                    multiple={true}
                    data-cy="beat-upload-stem-input"
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
        {alert ? (
          <Alert
            message={alert.message}
            type={alert.type}
            closable
            showIcon
            style={{ width: '50%', marginLeft: '25%', textAlign: 'center' }}
            data-cy="beat-upload-alert"
          />
        ) : null}
        <Divider />
        {isUploading ? (
          <>
            <p>Uploading beat...</p>
            <Progress percent={uploadProgress} strokeColor={'var(--primary)'} />
            {uploadProgress > 99 && stems ? (
              <>
                {/* make this show the total percentage of bytes from all stems */}
                <p>Uploading stems...</p>
                <Progress percent={stemUploadProgress} strokeColor={'var(--primary)'} />
              </>
            ) : null}
          </>
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
      </Modal>
    </>
  );
}
