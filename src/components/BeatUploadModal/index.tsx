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
import { PictureOutlined, SoundOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import axios, { AxiosResponse } from 'axios';
import Resizer from 'react-image-file-resizer';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getSignedUploadUrlReq } from '../../lib/axios';
import { genreOptions } from '../../utils/genreTags';
import UploadButton from '../UploadButton';
import styles from './BeatUploadModal.module.css';
import gatewayUrl from '../../config/routing';
import { getUserArtistNameFromLocalStorage, getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { useDispatch } from 'react-redux';
import { notification } from '../../reducers/notificationReducer';
import { Keys } from '../../types';
import { ensureLoggedIn } from '../../utils/auth';

export const possibleKeyOptions = Keys.map((key) => ({ value: key, label: key }));
interface Stem {
  audioKey: string;
  trackName: string;
  beatId: string;
}

interface IBeatUploadModalProps {
  // this will only accept antd buttons for now
  btn?: React.ReactNode;
  isOpenParent?: boolean;
  setIsOpenParent?: Dispatch<SetStateAction<boolean>>;
}

const isMobile = window.innerWidth < 480;

export default function UploadBeatModal(props: IBeatUploadModalProps) {
  const { btn, isOpenParent, setIsOpenParent } = props;

  const [showModal, setShowModal] = useState<boolean>(isOpenParent ? isOpenParent : false);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' }>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [stemUploadProgress, setStemUploadProgress] = useState<number>(0);
  const [preparingForStreaming, setPreparingForStreaming] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [genreTags, setGenreTags] = useState<Array<string>>();
  const [tempo, setTempo] = useState<string>();
  const [key, setKey] = useState<string>();
  const [flatOrSharp, setFlatOrSharp] = useState<'♭' | '♯' | ''>('');
  const [majorOrMinor, setMajorOrMinor] = useState<'major' | 'minor'>('major');
  const [artwork, setArtwork] = useState<Blob>();
  const [artworkTn, setArtworkTn] = useState<Blob>();
  const [audio, setAudio] = useState<File | Blob>();
  const [stems, setStems] = useState<File[]>([]);

  const stemFileNames: Array<string> = [];

  const dispatch = useDispatch();

  const handleCancel = () => {
    setIsOpenParent ? setIsOpenParent(false) : setShowModal(false);
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
      const isMp3 = audio?.type == 'audio/mp3';
      try {
        setIsUploading(true);
        // first get a url for the beat file since there will be always be one
        const beatUploadUrl = await getSignedUploadUrlReq('beat');
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
        // check if the audio is an mp3 file, if not make a converted copy for streaming
        let createMp3Res: AxiosResponse;
        let streamKey = s3Key;
        if (!isMp3) {
          console.log('detected uncompressed audio file...');
          setPreparingForStreaming(true);
          const createMp3Form = new FormData();
          createMp3Form.append('audio', audio as Blob);
          createMp3Res = await axios.post(`${gatewayUrl}/beats/create-mp3`, createMp3Form, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          streamKey = createMp3Res.data.streamKey;
        }
        const hasStems = stems.length > 0;
        const stemFields: Array<Stem> = [];
        // if artwork is provided, scale it and upload 2 sizes
        if (artwork) {
          const resizeArtworkPromise = resizeImage(artwork, 600);
          const resizeArtworkThPromise = resizeImage(artwork, 150);
          const [artworkFull, artworkTn] = await Promise.all([resizeArtworkPromise, resizeArtworkThPromise]);
          // convert base64 to blob
          const artworkFullBlobProm = fetch(artworkFull);
          const artworkTnBlobProm = fetch(artworkTn);
          const [fullBlob, tnBlob] = await Promise.all([artworkFullBlobProm, artworkTnBlobProm]);
          console.log('artowrkFull from resize function: \n', typeof fullBlob);
          setArtwork(await fullBlob.blob());
          setArtworkTn(await tnBlob.blob());
        }
        const beatFormData = new FormData();
        beatFormData.append('title', title);
        beatFormData.append('genreTags', JSON.stringify(genreTags));
        beatFormData.append('tempo', tempo as string);
        beatFormData.append('artwork', artwork as Blob);
        beatFormData.append('artworkTn', artworkTn as Blob);
        beatFormData.append('key', key as string);
        beatFormData.append('majorOrMinor', majorOrMinor as string);
        beatFormData.append('s3Key', s3Key);
        beatFormData.append('s3StreamKey', streamKey);
        beatFormData.append('fileName', (audio as File).name as string);
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

  const resizeImage = (image: Blob, hw: number): Promise<string> => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(image, hw, hw, 'PNG', 100, 0, (uri) => resolve(uri as string), 'base64');
    });
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
      {!isMobile && !btn ? (
        <Button
          type="ghost"
          onClick={async () => {
            try {
              await ensureLoggedIn();
              setIsOpenParent ? setIsOpenParent(true) : setShowModal(true);
            } catch (err) {
              console.error(err);
            }
          }}
          style={{ color: 'white' }}
          id="open-modal-btn"
          data-cy="upload-modal-nav"
        >
          Upload
        </Button>
      ) : (
        <>{btn}</>
      )}
      <Modal
        title="Upload Your Beat"
        open={showModal || isOpenParent}
        onCancel={handleCancel}
        footer={null}
        className={styles.modal}
        centered
        data-cy="modal"
      >
        <Spin
          spinning={isUploading}
          tip={
            'Your beat is being uploaded, you can close this window. You will be notified when it is done. DO NOT close your browser window as this could lead to your beat being corrupted'
          }
          indicator={<LoadingOutlined />}
          data-cy="spin"
        >
          <Form className={styles.form}>
            <Form.Item>
              <Input
                placeholder="Title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                data-cy="title-input"
                showCount
                minLength={6}
                style={{ fontSize: 'min(16px)' }}
              ></Input>
            </Form.Item>
            <Form.Item required={true}>
              <Select
                placeholder="Genre Tags"
                options={genreOptions}
                mode="multiple"
                maxTagCount="responsive"
                onChange={handleGenreTagsChange}
                style={{ fontSize: 'min(16px)' }}
                data-cy="genre-select"
              />
            </Form.Item>
            <Form.Item required style={{ fontSize: 'min(16px)' }}>
              <Input
                placeholder="BPM"
                onChange={(e) => {
                  setTempo(e.target.value);
                }}
                addonAfter="BPM"
                type="number"
                style={{ fontSize: 'min(16px)' }}
                data-cy="bpm-input"
              ></Input>
            </Form.Item>
            <Form.Item required style={{ fontSize: 'min(16px)' }}>
              <Select
                placeholder="Key"
                options={possibleKeyOptions}
                dropdownStyle={{ fontSize: 'min(16px)' }}
                style={{ fontSize: 'min(16px)' }}
                onChange={handleKeyChange}
              />
              <Form.Item style={{ justifyContent: 'center' }}>
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
            <Row className={styles['upload-btns-row']} justify={isMobile ? 'center' : 'start'}>
              <Col className={styles['upload-btns-col']} span={12}>
                <Form.Item>
                  <UploadButton
                    label="Artwork Upload"
                    allowedFileType="image/*"
                    uploadStateSetter={setArtwork}
                    sideIcon={<PictureOutlined />}
                  />
                  {/* {artwork ? <CheckCircleOutlined style={{ marginLeft: '1rem', fontSize: '1rem' }} /> : null} */}
                </Form.Item>
                <Form.Item style={{ width: '100%' }}>
                  <UploadButton
                    label="Beat Upload"
                    allowedFileType="audio/*"
                    uploadStateSetter={setAudio}
                    sideIcon={<SoundOutlined />}
                    data-cy="beat-upload-beat-input"
                  />
                  {/* {audio ? <CheckCircleOutlined style={{ marginLeft: '1rem', fontSize: '1rem' }} /> : null} */}
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
              <Col span={12}>
                <List
                  dataSource={stems.map((stemFile) => stemFile.name)}
                  bordered
                  size="small"
                  header={<strong>Stems</strong>}
                  renderItem={(item, index) => (
                    <List.Item style={{ width: '25vh' }} key={index}>
                      {item}
                      <DeleteOutlined
                        style={{ marginLeft: '2vw' }}
                        onClick={() => {
                          setStems(stems.filter((stem) => stem.name != item));
                        }}
                      />
                    </List.Item>
                  )}
                  style={{
                    maxHeight: '20vh',
                    minHeight: '20vh',
                    overflowY: 'scroll',
                    marginLeft: isMobile ? '2vw' : undefined,
                  }}
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
            {uploadProgress > 99 && stems.length > 0 ? (
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
                setIsOpenParent ? setIsOpenParent(false) : setShowModal(false);
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
