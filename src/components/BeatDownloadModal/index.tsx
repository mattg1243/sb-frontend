import { PlusOutlined } from '@ant-design/icons';
import JSZip from 'jszip';
import { Button, Modal, Progress, Spin } from 'antd';
import { useState } from 'react';
import styles from './BeatDownloadModal.module.css';
import gatewayUrl from '../../config/routing';
import axios, { AxiosResponse } from 'axios';
import CustomAlert from '../CustomAlert/index';
import { AlertObj } from '../../types';

interface IBeatDownloadModal {
  beatId: string;
  title: string;
  artistName: string;
}

export default function BeatDownloadModal(props: IBeatDownloadModal) {
  const { beatId, title, artistName } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [beatDownloading, setBeatDownloading] = useState(false);
  const [beatDownloadProgress, setBeatDownloadProgress] = useState<number>(0);
  const [stemDownloading, setStemDownloading] = useState(false);
  const [stemDownloadProgress, setStemDownloadProgress] = useState<number>(0);
  const [errorMsg, setErrMsg] = useState<AlertObj>();

  const zip = new JSZip();
  const downloadZip = zip.folder(`${title}-${artistName}`);

  const downloadBeat = async () => {
    const promiseArr: Array<Promise<AxiosResponse>> = [];
    if (!downloadZip) {
      console.log('error creating zip folder');
      return;
    }
    setLoading(true);
    try {
      setBeatDownloading(true);
      const res = await axios.get(`${gatewayUrl}/beats/download?beatId=${beatId}&`, {
        withCredentials: true,
      });
      console.log(res.data);
      // start downloading beat
      const downloadBeatRes = await axios.get(res.data.beat, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setBeatDownloadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      // add beat to zip file
      downloadZip.file(`${title}.mp3`, downloadBeatRes.data);
      // check for stems
      const stems = res.data.stems;
      if (stems) {
        setStemDownloading(true);
        const numOfStems: number = stems.length;
        let sizeOfStems = 0;
        let downloadedStemBytes = 0;
        for (let i = 0; i < numOfStems; i++) {
          const stemResPromise = axios.get(stems[i].url, {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
              if (progressEvent.total) {
                downloadedStemBytes += progressEvent.bytes;
                setStemDownloadProgress(Math.round(downloadedStemBytes / sizeOfStems));
              }
            },
          });
          //  not currently tracking properly
          sizeOfStems += parseInt((await stemResPromise).headers['Content-Length'] as string);
          promiseArr.push(stemResPromise);
        }
      }
      const stemDownloadResArr = await Promise.all(promiseArr);
      setBeatDownloading(false);
      setStemDownloading(false);
      // add the stems
      for (let j = 0; j < stems.length; j++) {
        downloadZip.file(stems[j].name, stemDownloadResArr[j].data);
      }
      // download zip
      const download = await downloadZip.generateAsync({ type: 'blob' });
      const href = URL.createObjectURL(download);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${title}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setErrMsg({ message: 'You may have insufficient credits', status: 'error' });
    } finally {
      setBeatDownloadProgress(0);
      setStemDownloadProgress(0);
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="ghost"
        onClick={() => {
          setOpen(true);
        }}
        icon={<PlusOutlined className={styles['plus-btn']} />}
      />
      <Modal
        title="Download & License Beat"
        open={open}
        centered
        onCancel={() => {
          setOpen(false);
        }}
        footer={[
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>,
          <Button
            onClick={() => {
              downloadBeat();
            }}
          >
            Download
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <h3>
            {title} - {artistName}
          </h3>
          {errorMsg ? (
            <>
              <CustomAlert message={errorMsg.message} status={errorMsg.status} />
            </>
          ) : (
            <p style={{ padding: '.5vw' }}>
              Are you sure you would like download and license this beat for 10 credits?
            </p>
          )}
        </Spin>
        {beatDownloading ? (
          <>
            <p>Downloading beats...</p>
            <Progress percent={beatDownloadProgress} strokeColor={'var(--primary)'} />
          </>
        ) : null}
        {stemDownloading ? (
          <>
            <p>Downloading stems...</p>
          </>
        ) : null}
      </Modal>
    </>
  );
}
